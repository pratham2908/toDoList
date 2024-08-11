import { useEffect, useState } from "react";
import styles from "../styles/tasks.module.scss";
import { Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Toaster, toast } from "react-hot-toast";
import LoginPage from "./LoginPage";

const Tasks = () => {
  const [user, setUser] = useState();
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState({ pendingTasks: [], doneTasks: [] });
  useEffect(() => {
    console.log("fetching tasks");
    fetch("/api/getTasks").then((res) => res.json()).then((data) => {
      setTasks(data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    const newTask = {
      description: taskDescription,
      created_by: user,
    }
    fetch("/api/addTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    }).then((res) => res.json()).then((data) => {
      if (data.status === 200) {
        setTasks({ ...tasks, pendingTasks: [...tasks.pendingTasks, newTask] });
        setTaskDescription("");
        toast.success(data.message);
      }
    }).catch((err) => {
      toast.error(err);
    });
  }

  const markTaskAsDone = (task) => {
    fetch("/api/doTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: task, modified_by: user }),
    }).then((res) => res.json()).then((data) => {
      if (data.status === 200) {
        const newPendingTasks = tasks.pendingTasks.filter((t) => t._id !== task._id);
        task.modified_by = user;
        setTasks({ ...tasks, pendingTasks: newPendingTasks, doneTasks: [...tasks.doneTasks, task] });
        toast.success(data.message);
      }
    }).catch((err) => {
      toast.error(err);
    });
  }

  const undoTask = (task) => {
    fetch("/api/undoTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: task }),
    }).then((res) => res.json()).then((data) => {
      if (data.status === 200) {
        const newDoneTasks = tasks.doneTasks.filter((t) => t._id !== task._id);
        delete task.modified_by;
        setTasks({ ...tasks, doneTasks: newDoneTasks, pendingTasks: [...tasks.pendingTasks, task] });
        toast.success(data.message);
      }
    }).catch((err) => {
      toast.error(err);

    });
  }

  const deleteTask = (task) => {
    fetch("/api/deleteTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: task }),
    }).then((res) => res.json()).then((data) => {
      if (data.status === 200) {
        const newPendingTasks = tasks.pendingTasks.filter((t) => t._id !== task._id);
        setTasks({ ...tasks, pendingTasks: newPendingTasks });
        toast.success(data.message);
      }
    }).catch((err) => {
      toast.error(err);
    });
  }

  const updateUser = (user) => {
    setUser(user);
  }

  return (
    user ? (
      <div className={styles.tasks}>
        <form onSubmit={addTask}>
          <input type="text" placeholder="Enter task" value={taskDescription} onChange={(e) => {
            setTaskDescription(e.target.value);
          }} />
          <Button type="submit" primary>Add Task</Button>

        </form>
        <div className={styles.tasks_container}>
          <table className={styles.pending_tasks_container}>
            <thead>
              <tr className={`${styles.pending_tasks_header} ${styles.tasks_header}`}>
                <th>Task</th>
                <th>Created By</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.pendingTasks.map((task) => (
                <tr key={task} className={styles.task}>
                  <td>{task.description}</td>
                  <td>
                    <img src={task.created_by?.avatar} /> {task.created_by?.name}
                  </td>
                  <td>
                    <Button primary onClick={(e) => {
                      markTaskAsDone(task);
                    }}>Done</Button>
                  </td>
                  <td>
                    <Button color="red" onClick={(e) => {
                      deleteTask(task);
                    }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className={styles.done_tasks_container}>
            <thead>
              <tr className={`${styles.done_tasks_header} ${styles.tasks_header}`}>
                <th>Task</th>
                <th>Created By</th>
                <th>Modified By</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.doneTasks.map((task) => (
                <tr key={task} className={styles.task}>
                  <td>{task.description}</td>
                  <td>
                    <img src={task.created_by?.avatar} /> {task.created_by?.name}
                  </td>
                  <td>
                    <img src={task.modified_by?.avatar} /> {task.modified_by?.name}
                  </td>
                  <td>
                    <Button primary onClick={(e) => {
                      undoTask(task);
                    }}>Not Done</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.user_data} onClick={() => {
          setUser(null);
        }}>
          <img src={user.avatar} alt={user.name} />
          <p>{user.name}</p>
        </div>
        <Toaster />
      </div >
    ) : (
      <LoginPage updateUser={updateUser} />
    )

  );
}

export default Tasks;