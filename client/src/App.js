import React, { useEffect, useState, Fragment, useRef } from "react";
import AirlineContract from "./airline";
import getWeb3 from "./getWeb3";
import MainLayout from "./components/MainLayout";
import { Row, Col, Card, Button } from "antd";
import Panel from "./components/Panel";
import useContractMethods from "./hooks/useContractMethods";
import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [balance, setBalance] = useState(0);
  const [airline, setAirline] = useState(undefined);
  const refAccount = useRef(account)

  const { flights, loyaltyPoints, refundableEther, buyFlight, yourFlights, redeemLoyaltyPoints } =
    useContractMethods(airline, web3, account);

  useEffect(() => {
    const connect = async () => {
      const web3 = await getWeb3();
      setWeb3(web3);

      const accounts = await web3.eth.getAccounts();

      window.ethereum.on("accountsChanged", async (accounts)=>{
        setAccount(accounts[0]);
      })
      setAccount(accounts[0]);
      
      const airline = await AirlineContract(web3.currentProvider);
      let flightPurchased = airline.FlightPurchased()
      flightPurchased.on("data", (event) => {
        const {customer, price, flight} = event.args;
        if(customer === refAccount.current){
          console.log(`you purchased a flight to ${flight} with a cost of ${price} wei`)
        }
      })
      setAirline(airline);
    };
    connect();
  }, []);

  useEffect(()=>{
    if(refAccount.current !== account){
      refAccount.current = account;
    }
  },[account])

  useEffect(() => {
    if (web3 && account) {
      getBalance();
    }
  }, [account, web3, airline]);

  const getBalance = async () => {
    const weiBalance = await web3.eth.getBalance(account);

    const etherBalance = await web3.utils.fromWei(weiBalance, "ether");
    setBalance(etherBalance);
  };

  return (
    <MainLayout>
      <Row gutter={16} style={{ margin: "50px 80px", rowGap: "20px" }}>
        <Col
          lg={12}
          sm={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card title="Balance" style={{ width: "100%", minHeight: 300 }}>
            <p>
              Address: <strong>{account}</strong>
            </p>
            <p>Balance: {balance}</p>
          </Card>
        </Col>
        <Col
          lg={12}
          sm={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            title="Available flights"
            style={{ width: "100%", minHeight: 300 }}
          >
            {flights.length > 0 ?
              flights.map(({ name, price }, index) => {
                return (
                  <p key={index}>
                    <span>
                      Name: {name} - Price: {price} ether{" "}
                    </span>
                    <Button
                      type="primary"
                      onClick={async () => {
                        const weiPrice = await web3.utils.toWei(price, "ether");
                        await buyFlight(index, account, weiPrice);
                      }}
                    >
                      Purchase
                    </Button>
                  </p>
                );
              }) : <p>No available flights</p>}
          </Card>
        </Col>
        <Col
          lg={12}
          sm={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            title="Loyalty points - refundable ether"
            style={{ width: "100%", minHeight: 300 }}
          >
            <p>Loyalty points: {loyaltyPoints}</p>
            <p>refundable Ether: {refundableEther}</p>
            <Button type="primary" onClick={async ()=> await redeemLoyaltyPoints(account)}>Refund</Button>
          </Card>
        </Col>
        <Col
          lg={12}
          sm={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            title="Your flights"
            style={{ width: "100%", minHeight: 300 }}
          >
            {yourFlights.length > 0 ? yourFlights.map(({ name, price }, index) => {
              return (
                <div key={index}>
                  {name} - cost: {price} ether
                </div>
              );
            }) : <p>You have no flights</p>}
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default App;
