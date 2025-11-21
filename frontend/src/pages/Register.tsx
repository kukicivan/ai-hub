import React, { useState } from "react";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { initializeCsrfProtection } from "@/redux/api/baseApi";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    user_type: "hotel",
    address_line_1: "",
    address_line_2: "",
    address_line_3: "",
    description: "",
    phone: "",
  });
  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await initializeCsrfProtection();
    await register(form);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Registracija</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Ime" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="password" type="password" placeholder="Lozinka" value={form.password} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="password_confirmation" type="password" placeholder="Potvrdi lozinku" value={form.password_confirmation} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="user_type" placeholder="Tip korisnika (npr. hotel)" value={form.user_type} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="address_line_1" placeholder="Adresa 1" value={form.address_line_1} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="address_line_2" placeholder="Adresa 2" value={form.address_line_2} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="address_line_3" placeholder="Adresa 3" value={form.address_line_3} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Opis" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={isLoading}>
          {isLoading ? "Registrujem..." : "Registruj se"}
        </button>
        {isSuccess && <div className="text-green-600">Uspešna registracija!</div>}
        {error && <div className="text-red-600">Greška pri registraciji!</div>}
      </form>
    </div>
  );
};

export default Register;
