import {
  Button,
  Form,
  Card,
  Input,
  Popconfirm,
  Table,
  Modal,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useSWR from "swr";
import http from "../../../utils/http";
import { formatDate } from "../../../../../backend/src/utils/date";


const { Item } = Form;

// 👉 Fetch data function for SWR
const fetcher = (url) => http.get(url).then((res) => res.data);

const Transactions = () => {
  const [form] = Form.useForm(); // 👉 Ant Design form instance
  const [edit, setEdit] = useState(null); // 👉 stores selected transaction for editing
  const [modal, setModal] = useState(false); // 👉 modal visibility
  const [loading, setLoading] = useState(false); // 👉 button loading state

  const[transactions,setTransactions]=useState([])
  const[no,setNo]=useState(0)
  const[pagination,setPagination]=useState({
    current:1,
    pageSize:2,
    total:0
  })

  // 👉 Table columns definition
  const columns = [
    { title: "Transaction Type", dataIndex: "transactionType" },
    { title: "Title", dataIndex: "title" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Payment Method", dataIndex: "paymentMethod" },
    { title: "Notes", dataIndex: "notes" },

    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date) => formatDate(date)
    },

    {
      title: "Action",
      render: (_, obj) => (
        <div className="flex gap-1">

          {/* 👉 EDIT BUTTON */}
          <Popconfirm
            title="Are you sure?"
            description="You can update again later"
            onCancel={() => toast.info("No changes occur")}
            onConfirm={() => onEditTransaction(obj)} // 👉 trigger edit
          >
            <Button
              type="text"
              className="!bg-green-100 !text-green-500"
              icon={<EditOutlined />}
            />
          </Popconfirm>

          {/* 👉 DELETE BUTTON */}
          <Popconfirm
            title="Are you sure?"
            description="Once deleted, you cannot restore"
            onCancel={() => toast.info("Your data is safe")}
            onConfirm={() => onDelete(obj._id)} // 👉 delete API
          >
            <Button
              type="text"
              className="!bg-rose-100 !text-rose-500"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>

        </div>
      ),
    },
  ];

  // 👉 Fetch transactions using SWR
  // const { data: transactions, error, isLoading } = useSWR(
  //   "/api/transaction/get",
  //   fetcher
  // );

  const fetchTransaction=async(page=1,pageSize=2)=>{
    try{
      setLoading(true)
      const res=await http.get(`/api/transaction/get?page=${page}&limit=${pageSize}`)
      const{data,total}=res.data
      setTransactions(data)
      setPagination({
        current:page,
        pageSize:pageSize,
        total:total
      })

    }catch(err){
      toast.error("Failed to Fetch Transactions")
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchTransaction(pagination.current,pagination.pageSize)
  },[no])
  // 👉 CREATE transaction
  const onFinish = async (values) => {
    try {
      setLoading(true);

      await http.post("/api/transaction/create", values);

      toast.success("Transaction Created Successfully");

      setNo(no+1); // 👉 refresh data
      setModal(false); // close modal
      form.resetFields(); // clear form
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 👉 DELETE transaction
  // const onDelete = async (id) => {
  //   try {
  //     setLoading(true);

  //     await http.delete(`/api/transaction/delete/${id}`);

  //     toast.success("Transaction Deleted successfully");

  //     setNo(no+1); // refresh table
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onDelete = async (id) => {
  try {
    setLoading(true);

    // 👉 Optimistic UI update (remove instantly from UI)
    setTransactions((prev) => prev.filter((item) => item._id !== id));

    await http.delete(`/api/transaction/delete/${id}`);

    toast.success("Transaction Deleted successfully");

    // 👉 optional: refresh from backend to stay in sync
    fetchTransaction(pagination.current, pagination.pageSize);

  } catch (err) {
    toast.error(err?.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  // 👉 OPEN EDIT MODE
  const onEditTransaction = (obj) => {
    setEdit(obj); // store selected row
    form.setFieldsValue(obj); // fill form with data
    setModal(true); // open modal
  };

  const handleTableChange=(pagination)=>{
    fetchTransaction(
      pagination.current,
      pagination.pageSize)
  }

  // 👉 UPDATE transaction
  const onUpdate = async (values) => {
    try {
      setLoading(true);

      await http.put(`/api/transaction/update/${edit._id}`, values);

      toast.success("Transaction Updated Successfully");

      setNo(no+1); // refresh table
      setModal(false);
      setEdit(null); // clear edit mode
      form.resetFields();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid">
        <Card
          title="Transaction List"
          style={{ overflowX: "auto" }}
          extra={
            <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-3">

              {/* 👉 Search input (UI only, no logic yet) */}
              <Input placeholder="Search by all" prefix={<SearchOutlined />} />

              {/* 👉 Open modal for new transaction */}
              <Button
                type="text"
                className="!font-bold !bg-blue-500 !text-white"
                onClick={() => setModal(true)}
              >
                Add New Transaction
              </Button>
            </div>
          }
        >
          {/* 👉 Table displaying transactions */}
          <Table
            columns={columns}
            dataSource={transactions || []} // fallback empty array
            rowKey="_id"
            scroll={{ x: "max-content" }}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </Card>
      </div>

      {/* 👉 MODAL */}
      <Modal
        open={modal}
        onCancel={() => {
          setModal(false); // close modal
          setEdit(null); // reset edit mode
          form.resetFields(); // clear form
        }}
        title="Add New Transaction"
        footer={null}
      >
        {/* 👉 FORM */}
        <Form
          form={form}
          layout="vertical"
          name="transactionForm"
          onFinish={edit ? onUpdate : onFinish} // 👉 switch create/update
        >
          <div className="grid md:grid-cols-2 gap-x-3">

            <Item
              label="Transaction Type"
              name="transactionType"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "CR", value: "cr" },
                  { label: "DR", value: "dr" },
                ]}
              />
            </Item>

            <Item label="Amount" name="amount" rules={[{ required: true }]}>
              <Input type="number" />
            </Item>
          </div>

          <div className="grid md:grid-cols-2 gap-x-3">

            <Item label="Title" name="title" rules={[{ required: true }]}>
              <Input />
            </Item>

            <Item
              label="Payment Method"
              name="paymentMethod"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Cash", value: "cash" },
                  { label: "Online", value: "online" },
                ]}
              />
            </Item>
          </div>

          <Item label="Notes" name="notes" rules={[{ required: true }]}>
            <Input.TextArea />
          </Item>

          {/* 👉 SUBMIT / UPDATE BUTTON */}
          <Item>
            <Button
              loading={loading}
              type="text"
              htmlType="submit"
              className={`!font-semibold !text-white w-full ${
                edit ? "!bg-red-500" : "!bg-blue-500"
              }`}
            >
              {edit ? "Update" : "Submit"}
            </Button>
          </Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Transactions;