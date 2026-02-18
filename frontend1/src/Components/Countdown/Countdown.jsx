import React, { useEffect, useState } from "react";
import axios from "axios";

const CountdownTimer = ({ categoryId, onTimeUpdate = '' }) => {
    const [timeLeft, setTimeLeft] = useState(null);


    useEffect(() => {

        const fetchCountdown = async () => {
            try {
                const res = await axios.get(
                    `https://api.ssdipl.com/api/countdown/get-countdown-by-category/${categoryId}`
                );
                console.log("SSSXXXX:=>", res)
                setTimeLeft(res?.data?.data);

                if (res.data?.data?.endTime) {
                    startTimer(new Date(res.data.data.endTime));
                }

            } catch (e) {
                console.log(e);
            }
        };

        if (categoryId) {
            fetchCountdown();
        }
    }, [categoryId])

    const startTimer = (endTime) => {
        const interval = setInterval(() => {
            const diff = endTime - new Date();

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft(null);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ hours, minutes, seconds });
            onTimeUpdate?.(diff);
        }, 1000);
    };




    if (!timeLeft) return null;

    return (
        <div className="countdown-box" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontWeight: 500, }}  >
            <i className="fa-solid fa-truck" style={{ fontSize: "18px", color: "#000" }}></i>

            <span>Get today! Order within</span>

            <strong className="countdown-timer" style={{ color: "#197889", fontWeight: 700 }}  >
                {String(timeLeft.hours).padStart(2, "0")}h :
                {String(timeLeft.minutes).padStart(2, "0")}m :
                {String(timeLeft.seconds).padStart(2, "0")}s
            </strong>
        </div>

    );
};

export default CountdownTimer;
