import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {ArrowLeft, Settings} from "lucide-react"; // 뒤로가기
import { Button } from "../../../../../components/ui/button.jsx"

import './followeeRefined.css';
import './followeeStyle.css';


const FolloweePage = () => {

    const [userName, setUserName] = useState("");
    // const [followersList, setFollowersList] = useState([]);
    const [isUsed, setIsUsed] = useState(true);
    const [followedUser, setFollowedUser] = useState([]);
    const [followerUser, setFollowerUser] = useState([]);

    // const [followee, setFollowee] = useState([]);
    // const [followees, setFollowees] = useState([]);

    // userData
    // useEffect(() => {
    //     const userId = "user1001";
    //     fetch(`/api/posting/${userId}/userpage.do`, {
    //         credentials: "include"
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log("서버로부터 받아온 유저 데이터:", data);
    //             setUserName(data.user.userName);
    //             setUserEmail(data.user.userEmail);
    //         })
    //         .catch((err) => console.error("사용자 정보 불러오기 실패", err));
    // }, []);

    // followeeData
    // useEffect(() => {
    //     const userId="user1001";
    //     fetch(`/api/posting/${userId}/followee.do`, {
    //         credentials: "include"
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             // const list = data.findByFolloweeId.map(item => item.followers);
    //             // console.log("데이터:", data);
    //             // console.log("팔로이 리스트:", list);
    //             const initialized = data.findByFolloweeId.map(item => ({...item.followers, isUsed: true}));
    //             setFollowedUser(initialized);
    //             console.log("데이터: ", data);
    //             console.log("확인: ", initialized);
    //             console.log("set??", setFollowedUser);
    //             console.log("그냥 followedUser??", followedUser);
    //             // setFollowersList(list);
    //             setUserName(data.user.userName);
    //         })
    //         .catch((err) => console.error("불러오기 실패",err));
    // }, []);
    useEffect(() => {
        const userId="user1001";
        fetch(`/api/posting/${userId}/follower.do`, {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                // const list = data.findByFolloweeId.map(item => item.followers);
                // console.log("데이터:", data);
                // console.log("팔로이 리스트:", list);
                const initialized = data.findByFollowerId.map(item => ({...item.followees, isUsed: true}));
                setFollowedUser(initialized);
                console.log("데이터: ", data);
                console.log("확인: ", initialized);
                console.log("set??", setFollowedUser);
                console.log("그냥 followedUser??", followedUser);
                // setFollowersList(list);
                setUserName(data.user.userName);
            })
            .catch((err) => console.error("불러오기 실패",err));
    }, []);

    const handleUnfollow = (userId) => {
        const followerId="user1001";
        const followeeId = userId;
        try{
            const response = fetch(`/api/posting/${followerId}/followee.do`, {
                method: "DELETE",
                credentials: "include",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({
                    followeeId: followeeId,
                    followerId: followerId
                })
            });

            if (response.ok) {
                setFollowerUser((prev) => prev.map((user) => user.userId === userId ? {...user, isUsed: false } : user));
            }else {
                alert("언팔로우 실패")
            }
        }catch (error) {
            console.log("언팔로우 실패",error);
            alert("오류");
        }
        // setIsUsed((prev) =>
        //     prev.map((user) => user.userId === userId ? {...user, isUsed: !user.isUsed} : user)
        // );
    };


    return (
        <div id="followeepage-body">
            {/* Header */}
            <header>
                <ul>
                    <li><h1>art U</h1></li>
                    <li><img src="/placeholder.svg" alt="profile_image"/></li>
                    <li><span>{userName}</span></li>
                </ul>
            </header>

            {/* Aside */}
            {/*<aside>*/}
            {/*    <div id="nav-container">*/}
            {/*        <section>*/}
            {/*            <h2>{userName}님의 Followee</h2>*/}
            {/*        </section>*/}
            {/*    </div>*/}
            {/*</aside>*/}

           <div id="main-container">
                <div className="container mx-auto py-8 px-4">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold mb-6 dark:text-white">{userName}님의 Followee</h1>

                        {followedUser.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">팔로워한 사용자가 없습니다.</p>
                        ) : (
                            <ul className="space-y-4">
                                {followedUser.map((f) => (
                                    <li key={f.userId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                        <div>
                                            <p className="font-semibold dark:text-white">{f.userName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{f.userEmail}</p>
                                            {/*<p className="text-sm text-gray-500 dark:text-gray-400">{followee.findByFolloweeId.followers.userImgUrl}</p>*/}
                                        </div>
                                            {/*<Button*/}
                                            {/*    key={f.userId}*/}
                                            {/*    variant={f.isUsed ? "disabled" : "default"}*/}
                                            {/*    className={f.isUsed ? "px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md" : ""}*/}
                                            {/*    onClick={() => handleUnfollow(f.userId)}*/}
                                            {/*>*/}
                                            {/*    {f.isUsed ? "언팔로우" : "팔로우"}*/}
                                            {/*</Button>*/}
                                            <Button
                                                key={f.userId}
                                                variant={f.isUsed ? "disabled" : "default"}
                                                onClick={() => handleUnfollow(f.userId)}
                                                className={f.isUsed ? "!bg-gray-200 !text-white !hover:bg-gray-300 !hover:text-gray-600" : ""}
                                            >
                                                {f.isUsed ? "언팔로우" : "팔로우"}
                                            </Button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-6">
                            <Link
                                to="/mypage"
                                className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                <span>마이페이지로 돌아가기</span>
                            </Link>
                            {/*<Link to="/mypage" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">*/}
                            {/*    <ArrowLeft className="w-4 h-4 mr-2" />*/}
                            {/*    <span>뒤로 가기</span>*/}
                            {/*</Link>*/}
                        </div>
                    </div>
                </div>
           </div>
        </div>
    )
}

export default FolloweePage;