import React from "react";
import { Card } from "antd";

const Panel = ({ title, content, account }) => {
  return (
    <Card title={title} style={{ width: "100%", minHeight:300 }}>
      {account && <p>{`Address: ${account}`}</p>}
      <p>{content}</p>
    </Card>
  );
};

export default Panel;
