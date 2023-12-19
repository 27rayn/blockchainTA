import axios from "axios";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import { fileABI, fileAddress } from "../utils/constants";

export const TransactionContext = React.createContext();
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZmI3MmQ3Mi0zYTFmLTQ5NDUtYTcyYy1lMTIxNzMwN2I1MWUiLCJlbWFpbCI6InJheXlhbmFudWdlcmFoMjAwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzY3OTdhNzdiNmUxZmRkNGQ3MmIiLCJzY29wZWRLZXlTZWNyZXQiOiI3MDg2NTgzMDczODY3YjVlMjdlZmQ4YzE2MTVjNzQxMzFiOThiZTU2OTc0N2I4MDdjZTEzMzBjNzExMTBiZTMxIiwiaWF0IjoxNjgwMzMyMjA3fQ.OxHQa7tiyMkTwlfDI2mj1sRLHhqLZ5P5A4ePe2lBzdY"

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    fileAddress,
    fileABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "0xcfE93A1c977869a88566D390b5a944287A3b1e90",
    amount: "",
    keyword: "",
    message: "",
    hashFile: "",
  });
  const [formDataFile, setFormDataFile] = useState({
    file: "",
    pinnedMetadata: "",
    pinataOptions: "",
  });
  const formDataFile2 = new FormData();
  const [imageFile, setImageFile] = useState("");
  const [imageName, setImageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const setValue = (value, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const setFileData = (name, value) => {
    setFormDataFile((prevState) => ({ ...prevState, [name]: value }));
  }

  const setHashFile = (hashFileInput) => {
    setFormData((prevState) => ({ ...prevState, ["hashFile"]: hashFileInput }));
  }

  const captureFile = (event) => {
    event.preventDefault();
    console.log("file captured...");
    // Process file for IPFS
    const file = event.target.files[0];
    setImageName(file.name);
    setImageFile(file);
  };

  const handleSubmit = async (e) => {

    formDataFile2.append('file', imageFile);

    const metadata = JSON.stringify({
      name: imageName,
    });
    formDataFile2.append('pinnedMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    })
    formDataFile2.append('pinataOptions', options);

    console.log(formDataFile2);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formDataFile2,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const { addressTo, amount, keyword, message } = formData;

    const hashFile = resFile.data.IpfsHash;

    e.preventDefault();

    if (!addressTo || !amount || !keyword || !message || !hashFile) return;

    sendTransaction(hashFile);
  };


  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask first");
      const transactionContract = getEthereumContract();

      const availableTransactions = await transactionContract.gettAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) =>
        ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
          hashFile: transaction.file,
          isValid: transaction.isValid,
        })
      );

      console.log(structuredTransactions);

      setTransactions(structuredTransactions);
      // console.log(availableTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask first");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("There is no account connected");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ETH object.");
    }
  };

  const checkIfTransactionExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);

      throw new Error("No ETH object.");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask first");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ETH object.");
    }
  };

  const sendTransaction = async (hashFile) => {
    try {
      if (!ethereum) return alert("Please install Metamask first");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 0,000021 or 21000 gwei
            value: parsedAmount._hex, // 0.00001
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword,
        hashFile
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.transactionHash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.transactionHash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());

      window.location.reload()
    } catch (error) {
      console.log(error);

      throw new Error("No ETH object.");
    }
  };

  const validate = async (index) => {
    try {
      if (!ethereum) return alert("Please install Metamask first");

      let dContinue = confirm("Apakah anda yakin ingin melakukan validasi data ini?");
      if (!dContinue) {
        return;
      }
      const transactionContract = getEthereumContract();

      const transactionHash = await transactionContract.validate(
        index, true
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.transactionHash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.transactionHash}`);

      window.location.reload()
    } catch (error) {
      console.log(error);

      throw new Error("No ETH object.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        captureFile,
        handleSubmit,
        validate,
        setValue,
        isLoading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
