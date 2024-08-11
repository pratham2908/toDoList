import { useState, useEffect } from "react";
import styles from "../styles/tasks.module.scss";
const LoginPage = ({ updateUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("/api/getUsers").then((res) => res.json()).then((data) => {
            console.log(data);
            setUsers(data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);



    return (
        <div className={styles.login_page}>
            <div className={styles.data_container}>
                <h1>Login as</h1>
                {users.map((user) => (
                    <div key={user._id} className={styles.user_data} onClick={() => {
                        updateUser(user);
                    }}>
                        <img src={user.avatar} alt={user.name} />
                        <p>{user.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LoginPage;