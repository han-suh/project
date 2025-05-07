"use client";

import { useState, useEffect } from "react";
//import { useRouter } from "next/navigation";
import {Link, useNavigate} from "react-router"
import { ArrowLeft, Bell, MessageSquare, Calendar, Info, X } from "lucide-react";
import Header from "/src/components/header";
import { useAuth } from "/src/lib/auth-context";

// Notification type definition
const NotificationsPage = () => {
  //const router = useRouter();
  const [loginUser, setLoginUser] = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      //router.push("/login");
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Load notifications
  useEffect(() => {
    if (user) {
      const mockNotifications = [
        {
          id: "notif1",
          type: "message",
          title: "새 메시지",
          content: "김예술님으로부터 새 메시지가 도착했습니다.",
          timestamp: "2024-03-14T10:30:00",
          isRead: false,
          linkTo: "/messages",
        },
        {
          id: "notif2",
          type: "event",
          title: "공연 알림",
          content: "예매하신 '봄의 선율: 클래식 음악회' 공연이 내일 예정되어 있습니다.",
          timestamp: "2024-03-13T09:00:00",
          isRead: false,
          linkTo: "/booking/음악-1",
        },
        {
          id: "notif3",
          type: "system",
          title: "시스템 알림",
          content: "art U 앱이 업데이트 되었습니다. 새로운 기능을 확인해보세요!",
          timestamp: "2024-03-12T15:30:00",
          isRead: true,
          linkTo: "/",
        },
        {
          id: "notif4",
          type: "event",
          title: "예매 확인",
          content: "'현대미술의 빛과 그림자 전시회' 예매가 확정되었습니다.",
          timestamp: "2024-03-11T11:20:00",
          isRead: true,
          linkTo: "/booking/미술-1",
        },
        {
          id: "notif5",
          type: "message",
          title: "새 메시지",
          content: "이음악님으로부터 새 메시지가 도착했습니다.",
          timestamp: "2024-03-10T14:15:00",
          isRead: true,
          linkTo: "/messages",
        },
        {
          id: "notif6",
          type: "system",
          title: "계정 알림",
          content: "비밀번호가 성공적으로 변경되었습니다.",
          timestamp: "2024-03-09T16:40:00",
          isRead: true,
          linkTo: "/mypage",
        },
        {
          id: "notif7",
          type: "event",
          title: "공연 변경 알림",
          content: "예매하신 '발레 갈라 콘서트: 백조의 호수' 공연 시간이 변경되었습니다.",
          timestamp: "2024-03-08T10:05:00",
          isRead: true,
          linkTo: "/booking/춤-1",
        },
      ];

      setNotifications(mockNotifications);
    }
  }, [user]);

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "어제";
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") {
      return !notification.isRead;
    }
    return true;
  });

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })));
  };

  // Delete notification
  const deleteNotification = (id, e) => {
    e.stopPropagation() // Prevent event bubbling
    e.preventDefault() // Prevent navigation
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "event":
        return <Calendar className="w-5 h-5 text-green-500" />;
      case "system":
        return <Info className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">


      <main className="flex-grow container mx-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-t-lg shadow-sm p-4 flex items-center justify-between border-b">
            <div className="flex items-center">
              <Link to="/messages" className="text-gray-700 hover:text-primary mr-3">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold">알림</h1>
            </div>
            {notifications.some((notification) => !notification.isRead) && (
              <button onClick={markAllAsRead} className="text-sm text-primary hover:text-primary/80">
                모두 읽음 표시
              </button>
            )}
          </div>

          <div className="bg-white flex border-b">
            <button
              className={`flex-1 py-3 text-center font-medium ${activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("all")}
            >
              전체
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium ${activeTab === "unread" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("unread")}
            >
              읽지 않음
            </button>
          </div>

          <div className="bg-white rounded-b-lg shadow-sm overflow-hidden">
            {filteredNotifications.length > 0 ? (
              <div>
                {filteredNotifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.linkTo || "#"}
                    className={`block p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.isRead ? "bg-blue-50" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 flex-shrink-0 mr-2">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <button
                                onClick={(e) => deleteNotification(notification.id, e)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                aria-label="알림 삭제"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{notification.content}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {activeTab === "all" ? "알림이 없습니다" : "읽지 않은 알림이 없습니다"}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;

