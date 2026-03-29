import { Button, Card, Divider } from "antd";
import {
  BarChartOutlined,
  DollarCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import DailyTransactionChart from "../DailyTransction";
import { generateFakeTransactions } from "../../../utils/fakeTransctions";
import { useState, useEffect } from "react";
import http from "../../../utils/http";
import Loader from "../Loader";

const fakeTransctions = generateFakeTransactions(30);

const Dashboard = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    http
      .get("/api/dashboard/report")
      .then((res) => setReport(res.data))
      .catch(console.error);
  }, []);

  if (!report) return <Loader />;

  const { summary, chart } = report;

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="shadow">
          <div className="flex justify-around items-center">
            <div className="flex items-center flex-col gap-y-2">
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                size="large"
                shape="circle"
                className="!bg-rose-600"
              />
              <h1 className="text-xl font-semibold text-rose-600">
                Transaction
              </h1>
            </div>
            <Divider type="vertical" className="h-24" />
            <div>
              <h1 className="text-3xl font-bold text-rose-400">
                {summary.totalTransaction} T
              </h1>
              <p className="text-lg mt-1 text-zinc-400">
                {summary.totalTransactionEstimate} Estimate
              </p>
            </div>
          </div>
        </Card>

        <Card className="shadow">
          <div className="flex justify-around items-center">
            <div className="flex items-center flex-col gap-y-2">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                size="large"
                shape="circle"
                className="!bg-green-600"
              />
              <h1 className="text-xl font-semibold text-green-600">
                Total Credit
              </h1>
            </div>
            <Divider type="vertical" className="h-24" />
            <div>
              <h1 className="text-3xl font-bold text-green-400">
                {summary.totalCredit} ₹
              </h1>
              <p className="text-lg mt-1 text-zinc-400">
                {summary.totalCreditEstimate} Estimate
              </p>
            </div>
          </div>
        </Card>

        <Card className="shadow">
          <div className="flex justify-around items-center">
            <div className="flex items-center flex-col gap-y-2">
              <Button
                type="primary"
                icon={<MinusCircleOutlined />}
                size="large"
                shape="circle"
                className="!bg-orange-600"
              />
              <h1 className="text-xl font-semibold text-orange-600">
                Total Debit
              </h1>
            </div>
            <Divider type="vertical" className="h-24" />
            <div>
              <h1 className="text-3xl font-bold text-orange-400">
                {summary.totalDebit} ₹
              </h1>
              <p className="text-lg mt-1 text-zinc-400">
                {summary.totalDebitEstimate} Estimate
              </p>
            </div>
          </div>
        </Card>

        <Card className="shadow">
          <div className="flex justify-around items-center">
            <div className="flex items-center flex-col gap-y-2">
              <Button
                type="primary"
                icon={<DollarCircleOutlined />}
                size="large"
                shape="circle"
                className="!bg-indigo-600"
              />
              <h1 className="text-xl font-semibold text-indigo-600">
                Balance
              </h1>
            </div>
            <Divider type="vertical" className="h-24" />
            <div>
              <h1 className="text-3xl font-bold text-indigo-400">
                {summary.balance} ₹
              </h1>
              <p className="text-lg mt-1 text-zinc-400">
                {summary.balanceEstimate} Estimate
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="hidden md:block mt-5 grid md:grid-cols-1">
        <DailyTransactionChart transactions={chart} />
      </div>
    </div>
  );
};

export default Dashboard;