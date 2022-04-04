import { useState, useEffect } from "react";

const useContractMethods = (contract, web3, address) => {
  const [flights, setFlights] = useState([]);
  const [yourFlights, setYourFlights] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  const buyFlight = async (flightIndex, from, value) => {
    try {
      await contract.buyFlight(flightIndex, { from, value });
    } catch (error) {
      console.log(error);
    }
  };

  const redeemLoyaltyPoints = async (from) => {
    try {
      await contract.redeemLoyaltyPoints({ from });
    } catch (error) {
      console.log(error);
    }  
  }

  useEffect(() => {
    const getFligths = async () => {
      const total = await contract.contract.methods.getTotalFlights().call();
      const flights = [];
      for (let i = 0; i < total; i++) {
        let flight = await contract.contract.methods.flights(i).call();
        const price = await web3.utils.fromWei(flight[1], "ether");

        flights.push({ name: flight[0], price });
      }
      setFlights(flights);
    };

    const getLoyaltyPoints = async () => {
      const points = await contract.contract.methods.customers(address).call();
      setLoyaltyPoints(points[0]);
    };

    const getYourFlights = async () => {
      const customerTotalFlights = await contract.contract.methods.customerTotalFlights(address).call();
      const fligths = []

      for (let i = 0; i < customerTotalFlights; i++) {
        const flight = await contract.customerFlights(address, i);
        const price = await web3.utils.fromWei(flight[1], "ether");
        fligths.push({ name: flight[0], price })
      }
      setYourFlights(fligths)
    };

    if (contract && web3) {
      getFligths();
      getLoyaltyPoints();
      getYourFlights()
    }else{
      setFlights([]);
      setYourFlights([]);
      setLoyaltyPoints(0);
    }
  }, [contract, web3, address]);

  return {
    flights,
    loyaltyPoints,
    refundableEther: (loyaltyPoints || 0) * 0.0005,
    buyFlight,
    yourFlights,
    redeemLoyaltyPoints
  };
};

export default useContractMethods;
