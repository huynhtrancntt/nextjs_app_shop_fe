'use client'
import Head from 'next/head'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useEffect } from 'react'

export default function Home() {
  const fetchApiUser = async () => {
    await axios.get("http://localhost:8000/api/users?limit=10&page=1&order=created%20asc").then((res) => {
      console.log("res", { res });

    })
  }

  useEffect(() => {
    fetchApiUser()
  }, [])

  return (
    <>
      <Head>
        <title>HT test </title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Button variant='contained'>Hello world HT  01 </Button>
    </>
  )
}
