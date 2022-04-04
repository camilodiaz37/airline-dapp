import React from "react";
import { Layout, Typography } from "antd";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const MainLayout = ({ children }) => {
  return (
    <Layout>
      <Header style={{ height: 70 }}>
        <Title style={{ textAlign: "center", margin: 0, lineHeight:"68px", color:"#ffffff" }}>
           Airline DAPP
        </Title>
      </Header>
      <Content style={{minHeight:"calc(100vh - 70px)"}}>{children}</Content>
    </Layout>
  );
};

export default MainLayout;
