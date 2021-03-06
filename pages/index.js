import Head from 'next/head'
import { useState, useEffect, useRef } from 'react';
import { connectToDatabase } from '../util/mongodb';
import Tabulator from "tabulator-tables";
import { Button, Form } from 'semantic-ui-react';
import 'tabulator-tables/dist/js/tabulator.min.js';
import "tabulator-tables/dist/css/tabulator.min.css"; 
import 'semantic-ui-css/semantic.min.css';


export default function Index(props) {
  
  const data = props.data;
  const [branchName, setBranchName] = useState("");
  let genDT = null;
 
  function setGenDT() {
      genDT = new Tabulator("#table", {
        layout:"fitColumns",
        height:800, 
        columns: [
          { title: "사업소명", field: "branch", editor:"input" },
          { title: "행정구역", field: "district", editor:"input" },
          { title: "태양광명", field: "sunlight", sorter: "date", editor:"input"},
          // { title: "용량 MW", field: "amountsMW", width: 150, editor:"input" },
          { title: "일시", field: "date", sorter:"date"},
          { title: "발전량 kWh", field: "amountsKWH" }
        ],
    });
  }

  function getGenData(){
    let tmp = [];
    const timeLine = [
      "0:00",
      "1:00",
      "2:00",
      "3:00",
      "4:00",
      "5:00",
      "6:00",
      "7:00",
      "8:00",
      "9:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00"
    ]

    data.map((item) => {
      for(let i=0 ; i < 24 ; i++){
        tmp.push({
          branch : branchName,
          district : item.district,
          sunlight : item.sunlight,
          date: item.date + " " + timeLine[i],
          amountsKWH: item.amountsKWH[i]
        });
      }
    })
    
    // setTimeout(() => {
      genDT.replaceData(tmp)
    // }, 10000);
  }
    
  function addBranch(){
    if(branchName == ""){
      alert("발전소명을 입력하세요!");
      return false;
    }

    console.log(genDT)
    genDT.updateData([{branch:branchName}]);
  }
  
  function downDT(){
    genDT.download("xlsx", "generation.xlsx", {sheetName:"발전소 원천 데이터"});
  };

  useEffect(() => {
    setGenDT();
    getGenData();
  }, []);

  return (
    <>
    <div className="wrap">
      <Head>
        <title>발전소 데이터 가공</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
      </Head>

      <div className="main">
        <header>
          <h1>발전소 데이터</h1>
        </header>

        <div className="container">
          <Form className="flex-center">
            <Form.Field>
              <label>발전소명</label>
              <Form.Input placeholder='발전소명을 입력하세요!' value={branchName} onChange={(e)=>setBranchName(e.target.value)} id="branchName"/>
            </Form.Field>
            
            <div className="btn-group">
              <Button color='orange' onClick={addBranch}>데이터 호출</Button>
              <Button color='green' onClick={downDT}>엑셀 다운로드</Button>
            </div>
          </Form>
          
          <div id="table"></div>
        </div>
      </div>
    </div>
    </>
  )
}


export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  // *** 이 부분 수정해서 사용하면 됨!
  const rawData = await db.collection("generation").find({}).toArray();
  // const rawData = await db.collection("generation").find({}).skip(100).limit(100).toArray();



  const parsingData = JSON.parse(JSON.stringify(rawData));
  const filteredData  = parsingData.map((item)=>{
    return{
      id : item._id,
      district : item.행정구역,
      sunlight : item.태양광명,
      // amountsKWH : item.배터리용량,  //원천 데이터 파일에 값이 있을 수도 있고, 없을 수도 있어서 일단 제외
      date : item.년월일,
      amountsKWH : [
        item.시간0,
        item.시간1,
        item.시간2,
        item.시간3,
        item.시간4,
        item.시간5,
        item.시간6,
        item.시간7,
        item.시간8,
        item.시간9,
        item.시간10,
        item.시간11,
        item.시간12,
        item.시간13,
        item.시간14,
        item.시간15,
        item.시간16,
        item.시간17,
        item.시간18,
        item.시간19,
        item.시간20,
        item.시간21,
        item.시간22,
        item.시간23
      ]
    }
  })

  return {
    props: { data:filteredData },
  }
}
