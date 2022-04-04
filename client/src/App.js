import React, { useEffect, useState, useRef } from "react";
import AirlineContract from "./airline";
import getWeb3 from "./getWeb3";
import MainLayout from "./components/MainLayout";
import { Row, Col, Card, Button, Image, List, Typography, notification } from "antd";
import useContractMethods from "./hooks/useContractMethods";
import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [balance, setBalance] = useState(0);
  const [airline, setAirline] = useState(undefined);
  const refAccount = useRef(account);

  const {
    flights,
    loyaltyPoints,
    refundableEther,
    buyFlight,
    yourFlights,
    redeemLoyaltyPoints,
  } = useContractMethods(airline, web3, account);

  useEffect(() => {
    if (refAccount.current !== account) {
      refAccount.current = account;
    }
  }, [account]);

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

  const connect = async () => {
    try {
    const web3 = await getWeb3();
    setWeb3(web3);

    const accounts = await window.ethereum
      .request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      .then(() =>
        window.ethereum.request({
          method: "eth_requestAccounts",
        })
      );

    window.ethereum.on("accountsChanged", async (accounts) => {
      setAccount(accounts[0]);
    });
    setAccount(accounts[0]);
      const airline = await AirlineContract(web3.currentProvider);

      let flightPurchased = airline.FlightPurchased();
      flightPurchased.on("data", (event) => {
        const { customer, price, flight } = event.args;
        if (customer === refAccount.current) {
          console.log(
            `you purchased a flight to ${flight} with a cost of ${price} wei`
          );
        }
      });
      setAirline(airline);
    } catch (e) {
      notification.error({
        message: 'Error',
        description:
          `${(e)}`,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
  };

  const disconnect = async () => {
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ eth_accounts: {} }],
      });
    } catch (e) {
      console.log(e);
    } finally {
      setWeb3(undefined);
      setAccount(undefined);
      setBalance(0);
      setAirline(undefined);
    }
  };

  return (
    <MainLayout account={account} disconnect={disconnect} connect={connect}>
      <Row gutter={16} style={{ margin: "50px 80px", rowGap: "20px" }}>
        <Col
          lg={12}
          sm={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card title="Balance" style={{ width: "100%", minHeight: 275 }}>
            {account ? (
              <p>
                Address: <strong>{account}</strong>
              </p>
            ) : (
              <div style={{ display: "flex" }}>
                <p>Connect your wallet to show your address</p>
                <Button
                  style={{
                    borderRadius: "5px",
                    width: "125px",
                    display: "flex",
                    justifyContent: "space-between",
                    marginLeft: "10px",
                  }}
                  onClick={async () => {
                    console.log("algo");
                    await connect();
                  }}
                >
                  Connect to
                  <Image
                    src="/metamask.png"
                    width="20px"
                    height="20px"
                    preview={false}
                  />
                </Button>
              </div>
            )}
            <p>Balance: {balance} ether</p>
          </Card>
        </Col>
        <Col
          lg={12}
          sm={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            title="Available flights"
            style={{ width: "100%", minHeight: 275 }}
          >
            {flights.length > 0 ? (
              <List
                bordered
                dataSource={flights}
                style={{ width: "100%" }}
                renderItem={(item, index) => (
                  <List.Item>
                    <Typography.Text>
                      Name: {item.name} - Price: {item.price} ether
                    </Typography.Text>
                    <Button
                      type="primary"
                      onClick={async () => {
                        const weiPrice = await web3.utils.toWei(
                          item.price,
                          "ether"
                        );
                        await buyFlight(index, account, weiPrice);
                      }}
                    >
                      Purchase
                    </Button>
                  </List.Item>
                )}
              />
            ) : (
              <p>No available flights</p>
            )}
          </Card>
        </Col>
        <Col
          lg={12}
          sm={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            title="Loyalty points - refundable ether"
            style={{ width: "100%", minHeight: 275 }}
          >
            <p>Loyalty points: {loyaltyPoints}</p>
            <p>refundable Ether: {refundableEther}</p>
            <Button
              type="primary"
              onClick={async () => await redeemLoyaltyPoints(account)}
            >
              Refund
            </Button>
          </Card>
        </Col>
        <Col
          lg={12}
          sm={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card title="Your flights" style={{ width: "100%", minHeight: 275 }}>
            {yourFlights.length > 0 ? (
              <List
                bordered
                dataSource={yourFlights}
                renderItem={(item) => {
                  return (
                    <List.Item>
                      <Typography.Text>
                        {item.name} - cost: {item.price} ether
                      </Typography.Text>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <p>You have no flights</p>
            )}
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default App;
