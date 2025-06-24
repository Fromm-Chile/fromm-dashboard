import axios, { AxiosError } from "axios";
import { apiUrl } from "../assets/variables";
import { useEffect, useState } from "react";
import Select from "react-select";
import useDebounce from "../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader";
import { InputController } from "../components/InputController";
import { TextareaController } from "../components/TextareaController";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { ModalConfirmacion } from "../components/ModalConfirmacion";

type UserSearch = {
  id: number;
  email: string;
  name: string;
  company: string;
  phone: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string(),
  company: yup.string().required("Company name is required"),
  message: yup.string().required("Message is required"),
});

export const NuevaCotizacion = () => {
  const [input, setInput] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserSearch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  const debouncedSearch = useDebounce(input, 800);

  useEffect(() => {
    if (!selectedUser) return;
    reset({
      name: selectedUser.name || "",
      email: selectedUser.email || "",
      phone: selectedUser.phone || "",
      company: selectedUser.company || "",
      message: "",
    });
  }, [reset, selectedUser]);

  const { data: users = [], isFetching } = useQuery({
    queryKey: ["users-search", debouncedSearch],
    queryFn: async () => {
      try {
        if (debouncedSearch.length < 3) return [];
        const { data }: { data: UserSearch[] } = await axios.get(
          `${apiUrl}/admin/users/email`,
          {
            params: { countryCode: "CL", email: debouncedSearch },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        return data;
      } catch (error) {
        if (error instanceof AxiosError && error.status === 401) {
          navigate("/login");
        } else {
          console.error("Unexpected error:", error);
        }
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const selectOptions = users.map((user) => ({
    value: user.email,
    label: `${user.name} (${user.email})`,
    user,
  }));

  const handleInputChange = (value: string) => {
    setInput(value); // Update the search input
  };

  const handleChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedUser(selectedOption.user); // Update the selected user
    } else {
      setSelectedUser(null); // Clear the selection
    }
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    setIsLoading(true);
    try {
      await axios.post(
        `${apiUrl}/admin/invoices`,
        {
          userId: selectedUser ? selectedUser.id : null,
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setModal(false);
      setIsLoading(false);
      navigate("/cotizaciones");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="m-auto max-w-[1150px] min-h-[600px] bg-white shadow-lg rounded-lg py-6 px-36 my-10">
        <h1 className="text-center text-2xl my-10 uppercase font-medium text-gray-700">
          Create a new quote
        </h1>
        <p className="mb-10">
          To generate a new quote, you must search for the user in the database
          using their <strong>email address</strong>.
        </p>
        <Select
          options={selectOptions}
          onInputChange={handleInputChange}
          onChange={handleChange}
          isLoading={isFetching}
          placeholder="Search user by email..."
          isClearable
          noOptionsMessage={() => (
            <div
              onClick={() => {
                console.log("first");
                reset({
                  name: "",
                  email: "",
                  phone: "",
                  company: "",
                  message: "",
                }); // Reset the form
                setSelectedUser(null); // Clear the selected user
                setInput(""); // Clear the search input
              }}
              style={{
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {debouncedSearch.length < 3
                ? "Type at least 3 characters"
                : "No results found. Click here to clear the form."}
            </div>
          )}
          loadingMessage={() => "Loading..."}
        />
        <div className="md:grid md:grid-cols-1 md:gap-0 my-10 mb-14">
          <div className="flex w-full gap-5 mb-5">
            <InputController
              control={control}
              name="name"
              placeholder="Name*"
              error={errors.name?.message}
              className="w-[50%]"
              disabled={selectedUser ? true : false}
            />
            <InputController
              control={control}
              name="email"
              placeholder="Email*"
              error={errors.email?.message}
              className="w-[50%]"
              disabled={selectedUser ? true : false}
            />
          </div>
          <div className="flex w-full gap-5 mb-5 flex-1/2">
            <InputController
              control={control}
              name="phone"
              placeholder="Phone"
              className="w-[50%]"
              disabled={selectedUser ? true : false}
            />
            <InputController
              control={control}
              name="company"
              placeholder="Company*"
              error={errors.name?.message}
              className="w-[50%]"
              disabled={selectedUser ? true : false}
            />
          </div>
          <TextareaController
            control={control}
            name="message"
            placeholder="Quote details*"
            error={errors.message?.message}
          />
          <div className="flex justify-center">
            <Button
              className="border border-black rounded-lg p-2 text-textGray font-bold uppercase cursor-pointer"
              onClick={handleSubmit(() => setModal(true))}
              link=""
            >
              CREATE QUOTE
            </Button>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-2 text-lg">
          <img src="/icons/left-arrow.svg" width={15} height={15} />
          <button
            className="cursor-pointer hover:text-red-600"
            onClick={() => navigate("/cotizaciones")}
          >
            Go back
          </button>
        </div>
      </div>
      <ModalConfirmacion
        text="Are you sure you want to create a new quote?"
        isOpen={modal}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={() => setModal(false)}
        isLoading={isLoading}
        hasComment={false}
      />
    </>
  );
};
