import React from "react";
import TransactionsManager from "./TransactionsManager";

function IncomesPage() {
  return <TransactionsManager transactionType="income" />;
}

function ExpensesPage() {
  return <TransactionsManager transactionType="expense" />;
}

export { IncomesPage, ExpensesPage };
