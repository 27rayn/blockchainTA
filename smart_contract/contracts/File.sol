//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract File {
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, 
    string message, uint256 timestamp, string keyword, string file);

    struct TransferStruct {
        address sender;  //Pengirim
        address receiver; //Penerima
        uint amount; //Jumlah ETH
        string message; // Nama Produk
        uint256 timestamp;
        string keyword; // LPPOM ID
        string file; // File Sertifikat
    }

    TransferStruct[]transactions;


    function addToBlockchain
    (address payable receiver, uint amount, string memory message,
    string memory keyword, string memory hashFile) 
    public {
        transactionCount += 1;
        transactions.push
        (TransferStruct
        (msg.sender, receiver, amount, message, block.timestamp, keyword, hashFile)
        );

        emit Transfer(msg.sender, receiver, amount, message,
        block.timestamp, keyword, hashFile);
    }
    function gettAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}