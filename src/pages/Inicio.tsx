import { useQuery } from "@tanstack/react-query";
import { Summary } from "../components/Summary";
import axios from "axios";
import { apiUrl } from "../assets/variables";
import { useUserStore } from "../store/useUserStore";
import { InputFecha } from "../components/InputDate";
import { useState } from "react";
import { Loader } from "../components/Loader";
import { Button } from "../components/Button";
import { Line } from "../components/Line";
import { Barras } from "../components/Bar";

type Invoices = {
  createdAt: Date;
  totalCount: number;
  totalAmountSum: number;
};

export const Inicio = () => {
  const [inputStartDate, setInputStartDate] = useState<Date | null>(
    new Date(new Date().setDate(1))
  );
  const [inputEndDate, setInputEndDate] = useState<Date | null>(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { countryCode } = useUserStore();

  const {
    data: {
      filteredInvoices = [],
      cotizacionesTotales = 0,
      montoTotal = 0,
    } = {},
    isLoading,
    refetch: refetchData,
  } = useQuery({
    queryKey: ["montos-fecha", startDate, endDate],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiUrl}/admin/invoices/montos/fechas`,
        {
          params: {
            countryCode,
            startDate: inputStartDate
              ? inputStartDate
              : new Date(new Date().setDate(1)),
            endDate: inputEndDate ? inputEndDate : new Date(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const filteredInvoices = data?.invoices.map((invoice: Invoices) => ({
        createdAt: new Date(invoice.createdAt),
        totalCount: invoice.totalCount,
        totalAmountSum: invoice.totalAmountSum,
      }));

      return {
        filteredInvoices,
        cotizacionesTotales: data.cotizacionesTotales,
        montoTotal: data.montoTotal,
      };
    },
    refetchOnWindowFocus: false,
  });

  const { data: cotizacionesVendidas = 0, refetch: refetchCount } = useQuery({
    queryKey: ["ventas-fecha", startDate, endDate],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiUrl}/admin/invoices/ventas/fechas`,
        {
          params: {
            countryCode,
            startDate: inputStartDate
              ? inputStartDate
              : new Date(new Date().setDate(1)),
            endDate: inputEndDate ? inputEndDate : new Date(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return data;
    },
  });

  const handleFilter = () => {
    setStartDate(inputStartDate); // Update the query parameters
    setEndDate(inputEndDate);
    refetchCount(); // Trigger the "ventas-fecha" query
    refetchData(); // Trigger the "montos-fecha" query
  };

  return (
    <>
      <div>
        <h1 className="text-4xl text-gray-500 text-center font-bold my-10">
          Quotes Summary
        </h1>
        <div className="flex gap-5 items-center justify-center border border-red-400 pt-2 rounded-2xl mb-5 bg-blue-100">
          <p className="text-xl text-gray-600">Selected date range</p>
          <InputFecha
            label="From"
            onChange={(e: Date[]) => {
              setInputStartDate(e[0]);
            }}
            value={inputStartDate || new Date(new Date().setDate(1))}
            obligatorio
          />
          <InputFecha
            label="To"
            onChange={(e) => {
              setInputEndDate(e[0]);
            }}
            value={inputEndDate || new Date()}
            obligatorio
          />
          <div>
            <Button
              link=""
              className="w-[150px] text-center"
              onClick={handleFilter}
            >
              Filter
            </Button>
          </div>
        </div>
        <div className="relative">
          {isLoading && <Loader />}
          <Summary
            total={cotizacionesTotales}
            enviada={montoTotal}
            pendiente={cotizacionesVendidas}
            tituloEnviada="Total Amount USD"
            tituloPendiente="Sold Quotes"
          />
          {filteredInvoices.length > 0 ? (
            <div className="flex gap-4 pb-10">
              <div className="bg-white p-1 rounded-2xl w-[50%]">
                <Line chartData={filteredInvoices} />
              </div>
              <div className="bg-white p-1 rounded-2xl w-[50%]">
                <Barras chartData={filteredInvoices} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-gray-500 text-xl">No data to display</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
