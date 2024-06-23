import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { Session } from "next-auth";
import { MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    taskTitle: "",
    taskDescription: "",
  });

  useEffect(() => {
    if (!session) {
      router.push("/");
    } else {
      // Fetch tasks for the logged-in user
    }
  }, [session, router]);

  useEffect(() => {
    console.log({ session });
    if (session?.accessToken && !tasksLoaded) {
      fetchTasks(session);
    }
  }, [session, tasksLoaded]);

  const fetchTasks = async (session: Session) => {
    if (session) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/tasks?email=${session?.user?.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setTasks(data);
        setTasksLoaded(true); // Mark tasks as loaded
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setTasks(tasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({ ...newTask, taskOwner: session?.user?.email }),
        }
      );
      const data = await response.json();
      setTasks((prev) => [...prev, data]);
      handleClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Layout>
      <div className="p-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your actions dashboard!</p>
        <div className="mt-4">
          <p className="font-semibold">Access Token:</p>
          <div className="border rounded p-2 mt-2 break-words">
            {session && session.accessToken}
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold">JWT Token:</p>
          <div className="border rounded p-2 mt-2 break-words">
            {session && session.jwtToken}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-center">Task Title</th>
                  <th className="py-2 px-4 border-b text-center">
                    Task Description
                  </th>
                  <th className="py-2 px-4 border-b text-center">Task Owner</th>
                  <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.taskId}>
                    <td className="py-2 px-4 border-b text-center">
                      {task.taskTitle}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {task.taskDescription}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {task.taskOwner}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <MdDelete
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDelete(task.taskId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            variant="contained"
            color="primary"
            className="mt-4"
            onClick={handleClickOpen}
          >
            Add Task
          </Button>
        </div>

        {/* Dialog for Adding New Task */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="taskTitle"
              label="Task Title"
              type="text"
              fullWidth
              value={newTask.taskTitle}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="taskDescription"
              label="Task Description"
              type="text"
              fullWidth
              value={newTask.taskDescription}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
}
