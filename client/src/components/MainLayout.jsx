import React from "react";
import { Button, Layout, Typography, Image } from "antd";
import Account from "./Account";

const { Content } = Layout;
const { Title } = Typography;
const MainLayout = ({ children, account, disconnect, connect }) => {
  return (
    <Layout>
      <div
        style={{
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          background: "black",
        }}
      >
        <Title
          style={{
            textAlign: "center",
            margin: 0,
            lineHeight: "68px",
            color: "#ffffff",
          }}
        >
          Airline DAPP
        </Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          {!account ? (
            <Button  style={{ borderRadius: "5px", width:"125px", display:"flex", justifyContent:"space-between" }} onClick={async ()=>await connect()}>
              Connect to
              <Image src="/metamask.png" width="20px" height="20px" preview={false}/>
            </Button>
          ) : (
            <Account account={account} />
          )}
          {account && (
            <Button style={{ marginLeft: "10px" }} onClick={async ()=>await disconnect()}>Disconnect</Button>
          )}
        </div>
      </div>
      <Content style={{ minHeight: "calc(100vh - 70px)" }}>{children}</Content>
    </Layout>
  );
};

export default MainLayout;
