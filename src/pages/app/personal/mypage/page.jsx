import React, {useState, useEffect} from "react";
import {Settings} from "lucide-react";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "/src/lib/auth-context";
import {Button} from "../../../../components/ui/button.jsx";

import './mypageStyle.css';
import './mypageRefined.css';
import './widgetStyle.css';
import './reactive.css';

import {renderWidgetContent} from "../../widget/widgetRenderer";
import {
    loadPosting,
    loadRemoveWidget, loadSavePostingComment,
    loadSaveWidgetsOrder,
    loadUser,
    loadUserPosting,
    loadWidgetsByUserId
} from "../../../../utils/eventFetch.js";
const Mypage = () => {
    const [widgets, setWidgets] = useState([]);
    const [draggingWidget, setDraggingWidget] = useState(null);
    const [loginUser, setLoginUser] = useAuth();
    const token = localStorage.getItem("jwt");
    const [userStats, setUserStats] = useState(null);
    const [selectedTab, setSelectedTab] = useState("widgets");
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [newPostComment, setNewPostComment] = useState("");
    const [likes, setLikes] = useState(false);

    // const userName = "사용자님";
    // const userEmail = "user@example.com";
    // const userIntroduction = "자기소개를 작성해보세요.";
    // const stats = {posts: 1234, followers: 5678, following: 910};

    useEffect(() => {

        const userId = "user1001"; // 가정된 유저 ID
        loadWidgetsByUserId(userId)
            .then((data) => {
                console.log("서버로부터 받아온 위젯 데이터:", data);
                const processedData = data.map(widget => ({
                    id: `widget${widget.widget_id}`,
                    type: widget.widget_json.type || "unknown",
                    label: widget.widget_json.label || "",
                    size: `${widget.widget_size}x1`
                }));
                setWidgets(processedData);
            })
            .catch((err) => {
                console.error("위젯 데이터를 가져오는 데 실패했습니다:", err);
            });
    }, []);

    useEffect(() => {
        if(!loginUser)return
        document.title = `${loginUser.userName}의 페이지`;
    }, [loginUser?.userName]);

    const onDragStart = (e, widgetId) => {
        setDraggingWidget(widgetId);
        e.dataTransfer.effectAllowed = "move";
        e.target.classList.add("dragging");
    };

    const onDragEnd = (e) => {
        e.target.classList.remove("dragging");
        setDraggingWidget(null);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("drag-over");
    };

    const onDrop = (e, targetIndex) => {
        e.preventDefault();
        const draggedWidget = widgets.find((widget) => widget.id === draggingWidget);
        if (!draggedWidget) return;

        const updatedWidgets = widgets.filter((widget) => widget.id !== draggingWidget);
        updatedWidgets.splice(targetIndex, 0, draggedWidget);
        setWidgets(updatedWidgets);

        saveWidgetOrder(updatedWidgets); // 순서 저장
        e.currentTarget.classList.remove("drag-over");
        setDraggingWidget(null);
    };

    const saveWidgetOrder = (updatedWidgets) => {
        const userId = "user1001";
        const orderData = updatedWidgets.map((widget, index) => ({
            widget_id: parseInt(widget.id.replace("widget", "")),
            user_id: userId,
            order: index
        }));

        loadSaveWidgetsOrder(orderData).then(res => {
            if (!res.ok) alert("순서 저장 실패");
        });
    };


    const [contextMenu, setContextMenu] = useState({visible: false, x: 0, y: 0, widgetId: null});

    const handleContextMenu = (e, widgetId) => {
        e.preventDefault();
        setContextMenu({visible: true, x: e.pageX, y: e.pageY, widgetId});
    };

    const handleCloseContextMenu = () => {
        setContextMenu({...contextMenu, visible: false});
    };

    const handleDeleteWidget = () => {
        const widgetIdNum = parseInt(contextMenu.widgetId.replace("widget", ""));
        if(!loginUser)return
        loadRemoveWidget(widgetIdNum, loginUser.userId)
            .then(res => {
                if (res.ok) {
                    setWidgets(prev => prev.filter(w => w.id !== contextMenu.widgetId));
                    setContextMenu({...contextMenu, visible: false});
                } else {
                    alert("삭제 실패");
                }
            })
            .catch(err => {
                console.error("삭제 중 오류:", err);
                alert("삭제 중 오류 발생");
            });
    };

    useEffect(() => {
        document.addEventListener("click", handleCloseContextMenu);
        return () => document.removeEventListener("click", handleCloseContextMenu);
    }, [contextMenu]);

    const navigate = useNavigate();

    // userData
    useEffect(() => {
        if(!loginUser)return
    loadUser(loginUser.userId)
        .then((data) => {
            // console.log("서버로부터 받아온 유저 데이터:", data);
            setUserStats({
                followers: data.countFollower,
                followees: data.countFollowee,
                countPosts: data.countPosting
            });
        })
        .catch((error) => {
            console.error("에러 발생:", error);
        });
    },[]);

    // postData
    useEffect(() =>{
        if(!loginUser)return
        if(selectedTab === "postings"){
            loadUserPosting(loginUser.userId)
                .then(async (data) => {setPosts(data);
                    console.log("서버로부터 받아온 유저 데이터:", data);})
                .catch((err) => console.error("게시물 불러오기 실패", err));
        }
    },[selectedTab]);

    // postingComment Input
    async function handleSubmitPostingComment()
    {
        if(!loginUser)return
        const resp = await loadSavePostingComment(selectedPost.postId, loginUser.userId, newPostComment);
        if (!resp.ok) {
            alert("댓글 등록 실패");
            return;
        }
        const data=await loadPosting(selectedPost.postId);
        setSelectedPost(()=>data);
        //setNewPostComment("");
    };

    return (
         userStats && (
    <div id="mypage-body">
        {/* Header */}
        <header>
            <ul>
                <li><h1>art U</h1></li>
                <li><img src="/placeholder.svg" alt="profile_image"/></li>
                <li><span>{loginUser.userName}</span></li>
            </ul>
        </header>

        {/* Aside */}
        <aside>
            <div id="nav-container">
                <section>
                    <h2>{loginUser.userName}님의 페이지</h2>
                    <article className="flex items-center">
                        <Link to="/settings" className="mr-2 text-lg text-blue-500 hover:underline">설정</Link>
                        <Settings className="inline-block mr-2 w-5"/>
                    </article>
                </section>
            </div>
        </aside>

        {/* Main Content */}
        <div id="main-container">
            <section>
                <div id="profile-container">
                    <img src="/placeholder.svg" alt="profile_image"/>
                    <ul>
                        <li><h3>{loginUser.userName}</h3></li>
                        <li><p>{loginUser.userEmail}</p></li>
                        <li><p><a href="/profile/edit">프로필 편집하기</a></p></li>
                    </ul>
                    <div id="profile-number-container">
                        <ul>
                            <li>
                                <div className="profile-number"><span>{userStats.countPosts}</span><Link
                                    to="/mypage" state={{ selectedTab: "postings" }}>게시물</Link></div>
                            </li>
                            <li>
                                <div className="profile-number"><span>{userStats.followees}</span><Link
                                    to="/follower">팔로워</Link></div>
                            </li>
                            <li>
                                <div className="profile-number"><span>{userStats.followers}</span><Link
                                    to="/followee">팔로잉</Link></div>
                            </li>
                        </ul>
                    </div>
                </div>
                {/*<article>*/}
                {/*    <p>{userIntroduction?.trim() || "자기소개가 없습니다. 프로필을 수정하여 자기소개를 작성해보세요."}</p>*/}
                {/*</article>*/}
            </section>
        </div>

        {contextMenu.visible && (
            <ul
                className="widget-context-menu"
                style={{
                    position: "absolute",
                    top: `${contextMenu.y}px`,
                    left: `${contextMenu.x}px`,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    padding: "5px 0",
                    zIndex: 9999,
                    listStyle: "none",
                }}
            >
                <li style={{padding: "5px 10px", cursor: "pointer"}}
                    onClick={() => navigate("/widget/edit", {state: {widgetId: contextMenu.widgetId}})}>편집
                </li>
                <li style={{padding: "5px 10px", cursor: "pointer"}} onClick={handleDeleteWidget}>삭제</li>
            </ul>
        )}

        {/* Widgets & Postings Tab */}
        <div className="flex justify-center space-x-4 mt-4 mb-4">
            <Button
                variant={selectedTab === "widgets" ? "default" : "secondary"}
                onClick={() => setSelectedTab("widgets")}
            >위젯
            </Button>
            <Button
                variant={selectedTab === "postings" ? "default" : "secondary"}
                onClick={() => setSelectedTab("postings")}
            >게시물
            </Button>
        </div>

        {/* Widgets */}
        {selectedTab === "widgets" && (
            <div id="widget-container">
                <button className="add-widget-button" onClick={() => navigate("/widget/add")}
                        style={{margin: "1rem", padding: "0.5rem 1rem"}}>
                    + 위젯 추가하기
                </button>
                <section onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}>
                    {widgets.map((widget, index) => (
                        <article
                            key={`${widget.id}-${index}`}
                            id={widget.id}
                            className={`widget size-${widget.size} ${widget.type} ${
                                widget.size === "1x1" ? "one-one" :
                                    widget.size === "2x1" ? "two-one" :
                                        widget.size === "3x1" ? "three-one" : ""
                            }`}
                            draggable={true}
                            onDragStart={(e) => onDragStart(e, widget.id)}
                            onContextMenu={(e) => handleContextMenu(e, widget.id)}
                        >
                            <div className={`${widget.type}-container`}>
                                {renderWidgetContent(widget)}
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        )}

        {/* Postings */}
        {selectedTab === "postings" && (
            <div id="post-container"
                 className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.postId} className="post-card bg-white shadow-md rounded-lg overflow-hidden p-2">
                            <img src={post.postingImages[0].imgUrl}
                                 alt="게시물 이미지"
                                 className="w-full h-60 object-cover rounded"
                                 onClick={() => {
                                     setSelectedPost(post);
                                     setCurrentImgIndex(0);
                                     setIsModalOpen(true);
                                 }}
                            />
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">등록된 게시물이 없습니다.</p>
                )}
            </div>
        )}

        {/* Modal */}
        {isModalOpen && setPosts && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
                 aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="bg-white rounded-lg max-w-xl w-full relative p-4">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-0 right-0 p-2">
                        X
                    </button>
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => setCurrentImgIndex((prev) => Math.max(prev - 1, 0))}
                                disabled={currentImgIndex === 0}>
                            ◀
                        </button>
                        {selectedPost?.postingImages?.[currentImgIndex]?.imgUrl && (
                            <img src={selectedPost.postingImages[currentImgIndex].imgUrl} alt="게시물 상세 이미지"
                                 className="w-full h-[500px] object-cover rounded"/>
                        )}
                        <button
                            onClick={() => setCurrentImgIndex((prev) => Math.min((prev + 1, selectedPost.postingImages.length - 1)))}
                            disabled={currentImgIndex === selectedPost.postingImages.length - 1}>
                            ▶
                        </button>
                    </div>

                    <p className="text-gray-800 mb-2">{selectedPost.contents}</p>

                    {/*<div className="flex items-center justify-between">*/}
                    {/*    <button className="text-red-500 text-xl" onClick={() => setLikes(!liked)}> {liked ? "❤️" : "🤍"}</button>*/}
                    {/*</div>*/}

                    <div className="mt-4 space-y-2">
                        {selectedPost.postingComments?.map((comment, idx) => (
                            <div key={idx} className="text-sm border-b pb-1">
                                {comment.user.userId} : {comment.contents}
                                {/*{comment.contents}*/}
                            </div>
                        ))}
                        <input
                            type="text"
                            placeholder="댓글을 입력하세요"
                            className="mt-2 w-full p-2 border rounded"
                            value={newPostComment}
                            onChange={(e) => setNewPostComment(e.target.value)}
                        />
                        <Button onClick={handleSubmitPostingComment}>댓글 등록</Button>
                    </div>
                </div>
            </div>
        )}

        {/* Footer */}
        <footer>
            <p>&copy; 2025 Art U</p>
            <address>
                <ul>
                    <li><a href="mailto:user@example.com"><img src="/placeholder.svg" alt="email"/></a></li>
                    <li><a href="https://www.youtube.com"><img src="/placeholder.svg" alt="youtube"/></a></li>
                    <li><a href="https://www.instagram.com"><img src="/placeholder.svg" alt="instagram"/></a></li>
                </ul>
            </address>
        </footer>
    </div>)
)
};

export default Mypage;