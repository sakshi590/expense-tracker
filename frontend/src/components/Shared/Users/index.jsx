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
  EyeInvisibleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useState ,useEffect} from "react";
import useSWR, { mutate } from "swr";
import http from "../../../utils/http";
import { formatDate } from "../../../../../backend/src/utils/date";

const { Item } = Form;

// Fetcher
const fetcher = (url) => http.get(url).then((res) => res.data);

export const Users = () => {
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const[users,setUsers]=useState([])
  const[no,setNo]=useState(0)
  const[pagination,setPagination]=useState({
    current:1,
    pageSize:2,
    total:0
  })

  const columns = [
    { title: "Role", dataIndex: "role", key: "role", className: "capitalize" },
    { title: "Fullname", dataIndex: "fullname", key: "fullname", className: "capitalize" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile", className: "capitalize" },
    { title: "Email", dataIndex: "email", key: "email" },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      className: "capitalize",
      render:(status,obj)=>(
        status?
        <Button
        shape="circle"
        icon={<EyeOutlined/>}
        className="!bg-green-500 !text-white"
        onClick={()=>onStatus(obj)}
        loading={loading}
        />
        :
        <Button
        shape="circle"
        icon={<EyeInvisibleFilled/>}
        className="!bg-rose-400 !text-white"
        onClick={()=>onStatus(obj)}
        loading={loading}
        />
      )
    },
  ];

  // ✅ FIXED API HERE
  // const { data: users, error, isLoading } = useSWR(
  //   "/api/user/get",
  //   fetcher
  // );
  
  const fetchUsers=async(page=1,pageSize=5)=>{
    try{
      setLoading(true)
      const res=await http.get(`/api/user/get?page=${page}&limit=${pageSize}`)
      const{data,total}=res.data
      setUsers(data)
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
    fetchUsers(pagination.current,pagination.pageSize)
  },[no])

  const onStatus = async (obj) => {
    try {
      setLoading(true);
      await http.put(`/api/user/status/${obj._id}`,{status:!obj.status});
      toast.success("Status Updated Successfully");
      setNo(no+1); // ✅ consistent
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTableChange=(pagination)=>{
    fetchUsers(
      pagination.current,
      pagination.pageSize)
  }

  return (
    <div>
      <div className="grid">
        <Card
          title="Transaction List"
          style={{ overflowX: "auto" }}
          extra={
            <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-3">
              <Input placeholder="Search by all" prefix={<SearchOutlined />} />
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={users || []}
            rowKey="_id"
            scroll={{ x: "max-content" }}
            loading={loading}
            onChange={handleTableChange}
            pagination={pagination}
          />
        </Card>
      </div>
    </div>
  );
};

export default Users;