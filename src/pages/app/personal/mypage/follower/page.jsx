import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {ArrowLeft, Settings} from "lucide-react"; // 뒤로가기
import {useAuth} from "/src/lib/auth-context";

import './followerRefined.css';
import './followerStyle.css';
import {Button} from "../../../../../components/ui/button.jsx";
import {loadFollowee, loadFollowers, loadSaveFollow} from "../../../../../utils/UserFetch.js";


const FollowerPage = () => {

    const [userName, setUserName] = useState("");
    const [isUsed, setIsUsed] = useState(true);
    const [followedUser, setFollowedUser] = useState([]);
    const [followeeUser, setFolloweeUser] = useState([]);
    const [loginUser, setLoginUser] = useAuth();
    const token = localStorage.getItem("jwt");

    // followerData
    // useEffect(() => {
    //     const userId="user1001";
    //     fetch(`/api/posting/${userId}/follower.do`, {
    //         credentials: "include"
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             // const list = data.findByFolloweeId.map(item => item.followers);
    //             // console.log("데이터:", data);
    //             // console.log("팔로이 리스트:", list);
    //             const initialized = data.findByFollowerId.map(item => ({...item.followees, isUsed: true}));
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
        // const userId="user1001";
        if(!loginUser)return;
       loadFollowee(loginUser.userId)
            .then((data) => {
                // const list = data.findByFolloweeId.map(item => item.followers);
                // console.log("데이터:", data);
                // console.log("팔로이 리스트:", list);
                const initialized = data.findByFolloweeId.map(item => ({...item.followers, isUsed: true}));
                setFollowedUser(initialized);
                console.log("데이터: ", data);
                // console.log("확인: ", initialized);
                // console.log("set??", setFollowedUser);
                // console.log("그냥 followedUser??", followedUser);
                // setFollowersList(list);
                setUserName(data.user.userName);
            })
            .catch((err) => console.error("불러오기 실패",err));
    }, []);

    const handleFollow =async (userId) => {
        if(!loginUser)return;
        const followeeId=loginUser.userId;
        const followerId=userId;
        try{
            const response=await loadSaveFollow({"followerId":followerId, "followeeId":followeeId});

            if (response.ok){
                alert("팔로우 성공");
                setFolloweeUser((prev) => prev.map((user) => user.userId === userId ? {...user, isUsed: true } : user));
            }else {
                alert("팔로우 실패")
            }
        }catch (error){
            console.log("팔로우 실패", error);
            alert("오류");
        }
        // setIsUsed((prev) =>
        //     prev.map((user) => user.userId === userId ? {...user, isUsed: !user.isUsed} : user)
        // );
    };


    return (
        <div id="followerpage-body">
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
            {/*            <h2>{userName}님의 Follower</h2>*/}
            {/*        </section>*/}
            {/*    </div>*/}
            {/*</aside>*/}

            {/*<div className="flex-grow container mx-auto px-4 pt-3">*/}
            {/*    <Link*/}
            {/*        to="/mypage"*/}
            {/*        className="inline-flex items-center text-gray-600 hover:text-primary mb-6">*/}
            {/*        <ArrowLeft className="w-4 h-4 mr-2" />*/}
            {/*        <span>마이페이지로 돌아가기</span>*/}
            {/*    </Link>*/}
            {/*</div>*/}

            <div id="main-container">
                <div className="container mx-auto py-1 px-4">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold mb-6 dark:text-white">{userName}님의 Follower</h1>

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
                                        {/*    variant={f.isUsed ? "default" : "disabled"}*/}
                                        {/*    onClick={() => handleFollow(f.userId)}*/}
                                        {/*    className={f.isUsed ? "px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md" : ""}*/}
                                        {/*>*/}
                                        {/*    팔로우*/}
                                        {/*</Button>*/}
                                        <Button
                                            key={f.userId}
                                            variant={f.isUsed ? "default" : "disabled"}
                                            className={f.isUsed ? "!bg-gray-700 !text-white !hover:bg-gray-300 !hover:text-gray-600" : ""}
                                            onClick={() => handleFollow(f.userId)}
                                        >
                                            {f.isUsed ? "팔로우" : "언팔로우"}
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
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default FollowerPage;