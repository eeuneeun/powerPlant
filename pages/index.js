import Head from 'next/head'
import { useState, useEffect } from 'react';
import { connectToDatabase } from '../util/mongodb';
import mongoKeyEsc from 'mongo-key-escape';

export default function Home({ properties }) {
  
  const [ data, setData ] = useState()
  
  useEffect(() => {
    setData(properties);
    console.log(data);
  }, []);

  return (
    <>
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>으아아~~</h1>
        {data && data.map((item)=>(
          <ul key={item.id}>
            <li>{item.branch}</li>
            <li>{item.district}</li>
            <li>{item.sunlight}</li>
            <li>{item.amount}</li>
          </ul>
        ))}
      </div>
    </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();
  const data = await db.collection("generation").find({}).limit(20).toArray();
  const data2 = await db.collection("generation").aggregate({
    $match : {
      "0:00" : "<value>"
    }
  });
  
  console.log(data2)

  const properties = JSON.parse(JSON.stringify(data));
  const filtered  = properties.map((item)=>{
    return{
      ...properties,
      id : item._id,
      branch : "한국남동발전",
      district : item.행정구역,
      sunlight : item.태양광명,
      date : item.년월일
    }
  })
  console.log(properties)

  return {
    props: { properties:properties },
  }
}
