import React from "react"
import {useState, useEffect} from "react"
import {Link, Outlet, useNavigate, useParams} from "react-router-dom"
import {Save, X, GripVertical, ChevronRight} from "lucide-react" // 깔끔한 아이콘 라이브러리임


// 카테고리 이미지 생성 함수
const generateCategoryImages = (category, count) => {
   return Array.from({length: count}, (_, i) => ({
      id: `${category}-${i + 1}`,
      src: `/placeholder.svg?height=300&width=400&text=${category}${i + 1}`,
      alt: `${category} 이미지 ${i + 1}`,
      title: `${category} 콘텐츠 ${i + 1}`,
      description: `${category} 관련 콘텐츠에 대한 간략한 설명입니다. 여기에는 ${category}에 관한 정보가 표시됩니다.`,
      bookable: i % 3 === 0, // 세 번째 항목마다 예약 가능으로 설정
   }))
}

const categoryObjKor = {
   "art": "미술",
   "dance": "춤",
   "acting": "연기",
   "musical": "뮤지컬",
   "music": "음악"
}


export default function MainPage() {

   const navigate = useNavigate()
   const params = useParams();

   // 카테고리 리스트 상태 ("전체" 카테고리 포함)
   const [categories, setCategories] = useState(["전체", "음악", "미술", "춤", "연기", "뮤지컬"])

   // 현재 선택된 카테고리 (기본값: 전체)
   const [activeCategory, setActiveCategory] = useState(categoryObjKor[params.category]);

   // 정렬을 재설정할까, 보여줄까 상태
   const [isReordering, setIsReordering] = useState(false)

   // 임시 정렬 상태 (정렬 조정하면서 사용)
   const [tempCategories, setTempCategories] = useState([])

   // 드래그한 아이템 인덱스와 드롭 대상 인덱스
   const [draggedItemIndex, setDraggedItemIndex] = useState(null)
   const [dragOverItemIndex, setDragOverItemIndex] = useState(null)

   // 카테고리별 이미지 데이터
   const categoryImages = {
      음악: generateCategoryImages("음악", 12),
      미술: generateCategoryImages("미술", 12),
      춤: generateCategoryImages("춤", 12),
      연기: generateCategoryImages("연기", 12),
      뮤지컬: generateCategoryImages("뮤지컬", 12),
   }

   // 정렬 모드 진입 시 현재 카테고리 순서를 임시 상태에 복사
   useEffect(() => {
      if (isReordering) {
         // "전체" 카테고리는 정렬에서 제외
         setTempCategories([...categories.filter((cat) => cat !== "전체")])
      }
   }, [isReordering, categories])

   // 카테고리 변경 핸들러
   const handleCategoryChange = (category) => {
      setActiveCategory(category)
   }

   // 정렬 모드 토글
   const toggleReorderMode = () => {
      setIsReordering(!isReordering)
   }

   // 정렬 저장
   const saveReordering = () => {
      // "전체" 카테고리는 항상 첫 번째 위치
      setCategories(["전체", ...tempCategories])
      setIsReordering(false)
   }

   // 드래그 시작 핸들러
   const handleDragStart = (index) => {
      setDraggedItemIndex(index)
   }

   // 드래그 오버 핸들러
   const handleDragOver = (e, index) => {
      e.preventDefault()
      setDragOverItemIndex(index)
   }

   // 드래그 종료 핸들러
   const handleDragEnd = () => {
      if (draggedItemIndex !== null && dragOverItemIndex !== null) {
         const newCategories = [...tempCategories]
         const draggedItem = newCategories[draggedItemIndex]

         // 드래그된 항목 제거
         newCategories.splice(draggedItemIndex, 1)

         // 드롭 위치에 삽입
         newCategories.splice(dragOverItemIndex, 0, draggedItem)

         setTempCategories(newCategories)
      }

      // 상태 초기화
      setDraggedItemIndex(null)
      setDragOverItemIndex(null)
   }

   const categoryMap = {
      "전체": "/",
      "음악": "/cate/music",
      "미술": "/cate/art",
      "춤": "/cate/dance",
      "연기": "/cate/acting",
      "뮤지컬": "/cate/musical",
   };

   return (
      <div className="min-h-screen flex flex-col">

         {/* 카테고리 네비네이션 포함 그 아래부분임. 즉 헤더는 따로 분리되어있음. */}
         {/* Main navigation ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */}
         <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="container mx-auto px-4">
               {isReordering
                  ? ( // 크게 삼항연산자.
                     // Reordering mode UI
                     <div className="py-6">

                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-lg font-medium">카테고리 순서 변경</h3>
                           <div className="flex gap-2">
                              <button onClick={saveReordering}
                                 className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary/90" >
                                 <Save className="w-4 h-4 mr-1"/>
                                 저장
                              </button>
                              <button onClick={toggleReorderMode}
                                 className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded" >
                                 <X className="w-4 h-4 mr-1"/>
                                 취소
                              </button>
                           </div>
                        </div>

                        <p className="mb-4 text-sm text-gray-500">
                           항목을 드래그하여 순서를 변경하세요 ("전체" 카테고리는 항상 첫 번째 위치에 고정됩니다) </p>

                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                           {tempCategories.map((category, index) => (
                              <li
                                 key={category}
                                 className={`flex items-center justify-between p-3 bg-white border rounded cursor-move 
                                 ${draggedItemIndex === index ? "opacity-50 border-dashed" : "" }`}
                                 onDragStart={() => handleDragStart(index)}
                                 onDragOver={(e) => handleDragOver(e, index)}
                                 onDragEnd={handleDragEnd}
                                 draggable
                              >
                                 <div className="flex items-center">
                                    <GripVertical className="w-5 h-5 mr-2 text-gray-400"/> {/* 별거아님. 이미지임 */}
                                    <span className="text-base">{category}</span>
                                 </div>
                              </li>
                           ))}
                        </ul>
                     </div>
                  )
                  : (
                     // Normal mode UI (category tabs)
                     <nav className="flex items-center overflow-x-auto py-4 -mx-4 px-4 md:px-0 md:mx-0 md:justify-center z-[5]">
                        {categories.map((category) => {
                           const categoryUrl = categoryMap[category] || `/${category.toLowerCase()}`

                           return (
                              <button
                                 key={category}
                                 className={`px-4 py-2 mx-1 text-base font-medium rounded-full transition-colors
                                  ${categoryObjKor[params.category] === category || (category === "전체" && !params.category)
                                       ? "bg-primary text-primary-foreground"
                                       : "text-gray-700 hover:bg-gray-100"
                                 }`}
                                 onClick={() => {
                                    handleCategoryChange(category) // 상태 변경
                                    navigate(categoryUrl) // URL 변경 (페이지 이동 없이)
                                 }}
                              >
                                 {category}
                              </button>
                           )
                        })}

                        <button
                           className="px-4 py-2 mx-1 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-full ml-4"
                           onClick={toggleReorderMode}> 순서변경
                        </button>
                     </nav>
                  )
               }
            </div>
         </div>


         {/* Main   ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */}
         <Outlet/> {/* 자식 라우트가 여기서 렌더링됨 */}


         {/* Footer ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */}
         <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">

               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                  <div>
                     <h3 className="text-lg font-semibold mb-4">art U</h3>
                     <p className="text-gray-400">다양한 예술 분야의 콘텐츠를 제공하는 커뮤니티 플랫폼입니다.</p>
                  </div>

                  <div>
                     <h3 className="text-lg font-semibold mb-4">카테고리</h3>
                     <ul className="space-y-2">
                        {categories
                           .filter((cat) => cat !== "전체") // [ "전체", "음악", "미술", "춤", "연기", "뮤지컬" ] 니까 "전체" 카테고리는 제외하고
                           .map((category) => {
                              const categoryUrl = categoryMap[category] || `/${category.toLowerCase()}`
                              // category.toLowerCase() : 모두 아니면, 자동으로 URL을 /카테고리명(소문자)로 만들어주는 거야. fallback(대비책) 마련.

                              return (
                                 <li key={category}>
                                    <button className="text-gray-400 hover:text-white"
                                            onClick={() => {
                                               handleCategoryChange(category) // 상태 변경 등
                                               navigate(categoryUrl)         // 라우팅 이동
                                               // onClick로 발생하는 함수 2개만 실행하면 되서 return이 없음.
                                            }}>
                                       {category}
                                    </button>
                                 </li>
                              )
                           })}
                     </ul>
                  </div>

                  <div>
                     <h3 className="text-lg font-semibold mb-4">고객센터</h3>
                     <ul className="space-y-2">
                        <li>
                           <Link to="/faq" className="text-gray-400 hover:text-white">자주 묻는 질문</Link>
                        </li>
                        <li>
                           <Link to="/contact" className="text-gray-400 hover:text-white">문의하기</Link>
                        </li>
                        <li>
                           <Link to="/terms" className="text-gray-400 hover:text-white">이용약관</Link>
                        </li>
                        <li>
                           <Link to="/privacy" className="text-gray-400 hover:text-white">개인정보처리방침</Link>
                        </li>
                     </ul>
                  </div>


                  <div>
                     <h3 className="text-lg font-semibold mb-4">소셜 미디어</h3>
                     <div className="flex space-x-4">
                        <Link to="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white" aria-label="Facebook">
                           {/* 링크에 target="_blank"를 쓰면 새 탭에서 열리는데, 기본적으로 새 탭은 원래 페이지(window.opener)에 접근할 수 있음.
                            따라서 noopener: 새 탭이 원래 탭(window.opener)을 참조할 수 없게 막음
                            noreferrer: 브라우저가 Referer(어디서 왔는지 정보)를 전송하지 않음(프라이버시 + 보안 강화) */}
                           {/* aria-label="Facebook" 는 접근성(Accessibility) 속성으로 화면 읽는 보조기기용 설명 제공 */}
                           {/* 이건 페이스북 로고 벡터 이미지 (SVG) */}
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                 fillRule="evenodd"
                                 d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                 clipRule="evenodd"
                              ></path>
                           </svg>
                        </Link>

                        <Link to="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white" aria-label="Instagram">
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                 fillRule="evenodd"
                                 d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                 clipRule="evenodd"
                              ></path>
                           </svg>
                        </Link>

                        <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white" aria-label="Twitter">
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                 d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                           </svg>
                        </Link>
                     </div>
                  </div>

               </div>

               <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                  <p>&copy; 2024 art U. All rights reserved.</p>
               </div>

            </div>
         </footer>
      </div>
   )
}

