# 🎵 Spotify Clone - Full-Stack Next.js 15 Application

Một ứng dụng streaming nhạc trực tuyến full-stack được xây dựng dựa trên kiến trúc hiện đại của **Next.js 15 (App Router)**, **TypeScript**, kết hợp với các giải pháp quản lý trạng thái, tối ưu hóa hiệu năng, và đồng bộ dữ liệu thời gian thực tiên tiến nhất. Dự án giả lập các tính năng cốt lõi của Spotify với tư duy thiết kế hệ thống sẵn sàng mở rộng (scalable).

---

## 🏗️ 1. Kiến Trúc Hệ Thống & Chiến Lược Render (Architecture & Rendering Strategy)

Dự án áp dụng mô hình **Hybrid Rendering** tận dụng tối đa cơ chế của Next.js 15 App Router kết hợp với hệ sinh thái TanStack React Query để tối ưu hóa tối đa tốc độ tải trang đầu tiên (FCP) và duy trì trải nghiệm mượt mà không gián đoạn (Zero-Flicker) khi tương tác.

### 🔄 Cơ chế Luồng Dữ liệu (Data Flow & Hybrid Hydration)

Để giải quyết bài toán tải trang nhanh nhưng vẫn phải đảm bảo tính năng tải vô hạn (Infinite Scroll) dữ liệu bài hát và cập nhật trạng thái Playlist theo thời gian thực, luồng render được thiết kế qua 2 giai đoạn:

1. **Server-Side Pre-fetching:** Khi người dùng truy cập trang, Next.js Server Component đảm nhận việc gọi trực tiếp API để lấy dữ liệu danh sách nhạc gốc (`initialSongs`). Dữ liệu này được nhúng trực tiếp vào mã HTML tĩnh gửi về trình duyệt. Người dùng sẽ thấy ngay giao diện danh sách bài hát mà không phải chờ đợi các vòng quay loading (Eliminating Client-side Spinners).
2. **Client-Side Hydration (TanStack Query):** Ngay sau khi HTML được tải xong, Client Component bọc ngoài sẽ tiếp quản cấu trúc dữ liệu tĩnh này bằng cách truyền `initialSongs` làm `initialData` cho các Hook như `useInfiniteSongs()`. Từ thời điểm này, toàn bộ logic Caching, Re-fetch khi chuyển trang, hay cơ chế cuộn vô hạn (Intersection Observer) đều được quản lý tập trung ở Client mà không cần render lại toàn bộ trang từ Server.

### 🧩 Phân Tách Component Chiến Lược (Server vs. Client Boundary)

Ứng dụng cô lập ranh giới giữa thành phần tĩnh (Server) và thành phần động (Client) một cách nghiêm ngặt nhằm tránh việc lạm dụng `"use client"` làm phình to dung lượng JavaScript Bundle của trình duyệt:

* **Server Component Layer (Layout & Pages):** Quản lý cấu trúc khung của trang, xử lý kiểm tra phiên làm việc người dùng (Session via Better-Auth Middleware) và tiền xử lý dữ liệu (Pre-fetching Data).
* **Client Component Layer (Interactive Components):** * **Audio Player Core:** Được đóng gói biệt lập để duy trì trạng thái phát nhạc liên tục khi người dùng chuyển trang (Persistent Playback). Toàn bộ Global State điều khiển nhạc (Play, Pause, Shuffle, Volume) được quản lý tách biệt qua **Zustand Store** kết hợp với `localStorage` để đồng bộ lại phiên nghe khi F5.
  * **Search & UI Controls:** Ứng dụng các kỹ thuật tối ưu hóa như **Debounce (300ms)** cho thanh tìm kiếm và **Optimistic Updates** (Cập nhật giao diện lập tức trước khi Server phản hồi) cho các hành động tương tác nhanh như Thêm/Xóa bài hát khỏi Playlist hay Thích (Like) bài hát.

### 🖼️ Tối Ưu Hóa Tài Nguyên Media (Media & Performance Optimization)

* **Image Optimization:** Sử dụng thành phần `<Image />` thế hệ mới của Next.js để tự động tối ưu hóa kích thước ảnh bìa Album/Bài hát từ CDN Cloudinary, tự động chuyển đổi sang định dạng `.webp` dung lượng siêu nhẹ và áp dụng Lazy Loading dựa trên Viewport của người dùng.
* **Stream Performance:** Tách biệt hoàn toàn các logic xử lý sự kiện tần suất cao (như `onTimeUpdate` từ HTML5 Audio) ra khỏi các Component hiển thị tĩnh nhằm tối giản hóa chu kỳ Re-render của React DOM, hạn chế tối đa hiện tượng tụt khung hình (Jank/Lag) khi đĩa nhạc đang xoay.

---

## 🚀 2. Đánh Giá Tính Năng Cốt Lõi (Features Review)

* **Hệ thống Xác thực Bảo mật (Authentication):** Tích hợp giải pháp **Better-Auth / OAuth 2.0 (Google Sign-In)** giúp xử lý phiên đăng nhập an toàn ở cả môi trường Server (Middleware bảo vệ route) và Client.
* **Hệ thống Audio Player Toàn diện (Core Music Streaming):**
  * Quản lý trạng thái phát nhạc toàn cục (Play/Pause, Skip, Previous, Shuffle, Loop).
  * Xử lý mượt mà luồng hàng chờ phát nhạc (Queue Management).
* **Quản lý Playlist & Thư viện Cá nhân:** Cho phép người dùng tạo playlist, thêm/xóa bài hát vào danh sách yêu thích trực thời gian thực, tự động cập nhật UI mà không cần tải lại trang.
* **Tải lên & Lưu trữ File Media:** Tích hợp với **Cloudinary CDN** để tối ưu hóa việc lưu trữ, phân phối file âm thanh (`.mp3`) và hình ảnh bọc ảnh bìa chất lượng cao với băng thông tối ưu.

---

## ⚡ 3. Tối Ưu Hóa Hiệu Năng & Trải Nghiệm Hệ Thống (Performance & Optimization)

Hiệu năng và độ phản hồi là ưu tiên hàng đầu nhằm mang lại trải nghiệm phát nhạc không gián đoạn (Zero-lag Experience). Các giải pháp kỹ thuật nâng cao đã được áp dụng bao gồm:

### ⏱️ Kiểm soát Tần suất Xử lý Sự kiện (Debounce & Throttle)
* **Debounce cho Tìm kiếm (Search Input):** Áp dụng Custom Hook `useDebounce` với độ trễ `300ms` cho tính năng tìm kiếm bài hát trực tiếp qua API. Cơ chế này chặn đứng việc gửi request liên tục theo từng ký tự người dùng nhập, giảm tải hệ thống đáng kể.
* **Tối ưu hóa Audio Event:** Sự kiện cập nhật tiến trình nhạc (`onTimeUpdate` từ HTML5 Audio) kích hoạt liên tục (vài mili-giây một lần). Các hàm cập nhật State giao diện của thanh phát nhạc được cô lập hoàn toàn khỏi các component tĩnh để tránh hiện tượng kích hoạt Re-render diện rộng (Massive Re-renders), giữ vững chỉ số FPS của trình duyệt khi đĩa nhạc đang xoay.

### 🔄 Quản lý Dữ liệu Thông minh & Infinite Scroll (TanStack Query)
* **Chiến lược Caching nâng cao:** Sử dụng **TanStack React Query** để quản lý tầng Client-Side Fetching với các cấu hình thông minh (`staleTime`, `cacheTime`). Tắt tính năng tự động gọi lại API khi chuyển tab (`refetchOnWindowFocus: false`) để tránh lãng phí băng thông server không cần thiết.
* **Cuộn vô hạn (Infinite Scroll) hiệu năng cao:** Tích hợp API **Intersection Observer** ở tầng Client kết hợp với `useInfiniteSongs` của React Query để tự động nhận diện điểm cuối trang (`loadMoreRef`) và kích hoạt tải trang tiếp theo (`fetchNextPage`). Giải pháp này thay thế hoàn toàn cho sự kiện cuộn trang truyền thống (`window.onscroll`), tối ưu hóa CPU cho trình duyệt.
* **Optimistic Updates (Cập nhật giao diện trước):** Áp dụng cho các tính năng tương tác nhanh như Thêm/Xóa bài hát khỏi Playlist hay Thích (Like) bài hát. Hệ thống sẽ ngay lập tức cập nhật UI cho người dùng (Instant Feedback) trước khi đợi phản hồi thành công từ database, tạo cảm giác ứng dụng chạy mượt mà không có độ trễ.

### 🖼️ Tối ưu tài nguyên hình ảnh & Media thế hệ mới
* Tận dụng thành phần `<Image />` độc quyền của Next.js kết hợp dịch vụ CDN để tự động nén, chuyển đổi định dạng ảnh bìa album sang các định dạng thế hệ mới (`.webp`) với dung lượng siêu nhẹ, kết hợp cơ chế tự động Lazy Loading dựa trên Viewport giúp tăng đáng kể điểm số Core Web Vitals của dự án.

---

## 🧼 4. Kỷ Luật Viết Code & Quy Chuẩn Mã Nguồn (Clean Code Practices)

Dự án được viết tuân thủ nghiêm ngặt các nguyên tắc Clean Code nhằm phục vụ việc bảo trì và làm việc nhóm lâu dài:

* **Strict TypeScript:** Nói KHÔNG với kiểu `any`. Tất cả dữ liệu trả về từ API, các luồng State của Player hay Models của MongoDB đều được định nghĩa Type rõ ràng, giảm thiểu tối đa lỗi Runtime bất ngờ.
* **Zustand Clean State:** Khác với Redux rườm rà, Zustand được tách nhỏ theo từng Domain State (ví dụ: `usePlayerStore` độc lập với `useAuthStore`). Các hàm làm thay đổi State (Actions) được khai báo tập trung ngay trong Store giúp dễ dàng Trace log và Debug.
* **Custom Hooks Extraction:** Tách toàn bộ logic phức tạp của thẻ `<audio>` ra khỏi tầng giao diện (UI) và đưa vào các custom hooks (như `useAudioPlayer.ts`). Component giao diện chỉ làm đúng một nhiệm vụ là Render UI.
* **Component Reusability:** Tuân thủ nguyên tắc **SOLID (Single Responsibility)**. Các thành phần nhỏ như Card bài hát, nút điều khiển, thanh Volume được tách thành các Atomic Components để dễ dàng tái sử dụng.

---

## 🛠️ Hướng dẫn Khởi chạy Dự án (Getting Started)

1. **Clone mã nguồn:**
   ```bash
   git clone [https://github.com/fuuuuuuu28/spotify-clone.git](https://github.com/fuuuuuuu28/spotify-clone.git)
   cd spotify-clone