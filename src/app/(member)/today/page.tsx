'use client'

import { useState } from "react"

export default function Page() {
  const [date, setDate] = useState();
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


  }
}