const fs = require('fs');
const helpers = require('./helpers');
const tableHeader = helpers.tableHeader;
const investmentObj = {
  currentInvestment: 3000,
  interestRate: 13.14,
  investmentTerm: 12,
}

function calculateSip() {
  const totalInvestment = investmentObj.currentInvestment * investmentObj.investmentTerm;
  const interestEarned = Math.floor((totalInvestment * investmentObj.interestRate) / 100);
  const corpusWithCAGR = totalInvestment + interestEarned;
  const updatedInvestmentObj = {
    ...investmentObj,
    totalInvestment: putCommas(totalInvestment),
    interestEarned: putCommas(interestEarned),
    corpusWithCAGR: putCommas(corpusWithCAGR),
  }
  writeCalculationToFile(updatedInvestmentObj);
}

function putCommas(amount){
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function writeCalculationToFile(updatedInvestmentObj){
  const tableBody = `| ${updatedInvestmentObj.currentInvestment} | ${updatedInvestmentObj.investmentTerm} | ${updatedInvestmentObj.interestRate} | ${updatedInvestmentObj.totalInvestment} | ${updatedInvestmentObj.interestEarned} | ${updatedInvestmentObj.corpusWithCAGR}`
  const fullTable = tableHeader.concat("\n" + tableBody);
  fs.writeFile("calculation.md", fullTable, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("Investment calculations have been written to a file calculation.md");
  });
}

calculateSip();
