import React from "react";
import Paragraph from "antd/lib/typography/Paragraph";
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import styled from "styled-components";

const StyledParagraph = styled(Paragraph)`
  color: #ffffff !important;
  border: 2px solid #ffffff !important;
  padding: 5px 15px;
  border-radius: 5px;
  margin-bottom: 0 !important;
  font-weight:900;
`;

const Account = ({ account }) => {
  return (
    <StyledParagraph
      copyable={{
        icon: [
          <CopyOutlined key="copy-icon" style={{ color:"#ffffff" }} />,
          <CheckOutlined key="copied-icon" style={{ color:"#ffffff" }} />,
        ],
        tooltips: false,
        text:account,
      }}
    >
      {`${account.slice(0, 11)}...`}
    </StyledParagraph>
  );
};

export default Account;
