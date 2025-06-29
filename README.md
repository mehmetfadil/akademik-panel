# 🎓 Akademik Panel

Bu proje, üniversite bölümlerinin **ders programı hazırlama**, **sınav takvimi oluşturma** ve **derslik yönetimi** gibi karmaşık akademik süreçlerini kolaylaştırmak amacıyla geliştirilmiş bir web uygulamasıdır. Hem akademisyenlerin hem de bölüm yönetiminin ihtiyaçları göz önünde bulundurularak tasarlanmıştır.

---

## ✨ Projenin Amacı ve Özellikleri

Akademik Panel; aşağıdaki temel işlemleri dijital ortama taşıyarak verimliliği artırmayı ve manuel yapılan işleri otomatikleştirmeyi hedefler:

- **Kullanıcı Yönetimi:** Admin ve Öğretim Elemanı (oe) rolleriyle farklı yetkilere sahip kullanıcılar.
- **Ders Programı Hazırlama:** Sürükle-bırak arayüzü ile haftalık program oluşturma.
- **Derslik Yönetimi:** Derslik tanımlama, kapasite belirleme, programa göre derslik görüntüleme.
- **Sınav Takvimi:** Haftalık sınav planı oluşturma. Admin ve öğretim elemanları arasında yorumlaşma özelliği.
- **Oturma Düzeni:** Rastgele oturma planı oluşturma ve PDF çıktısı alma.
- **Kapı İsimliği:** Akademisyenlerin haftalık programlarını içeren PDF formatında isimlik oluşturma.
- **Dinamik Arayüz:** Kullanıcı rolüne göre menü ve bileşenler değişmektedir.

---

## 💻 Kullanılan Teknolojiler

### Frontend

- **React**
- **Tailwind CSS**
- **React-DND** (sürükle-bırak desteği)
- **jsPDF & html2canvas** (PDF çıktısı)

### Backend

- **ASP.NET Core Web API**
- **Entity Framework Core**
- **SQL Server**

---

## 📂 Proje Mimarisi

## 🗄️ Veritabanı Varlık İlişkileri (Entity Relationships)

Veritabanı tasarımı, akademik yapının temel taşlarını modelleyecek şekilde kurgulanmıştır. Varlıklar arasındaki ilişkiler aşağıda şematize edilmiş ve detaylarıyla açıklanmıştır.

### 🔍 Varlık İlişkileri Açıklamaları

#### 🏛️ Department → Course / Room  
Bir `Department` (Bölüm), birden fazla `Course` (Ders) ve birden fazla `Room` (Derslik) içerebilir.  
Bu ilişkiler **bire-çok (one-to-many)** yapıda tanımlanmıştır.

#### 👨‍🏫 Users → Course  
Bir `User` (Öğretim Elemanı veya Kullanıcı), birden fazla `Course` (Ders) verebilir.  
Bu da yine **bire-çok (one-to-many)** bir ilişkidir.

#### 🕒 Schedule (Merkez Varlık)  
`Schedule` (Program) tablosu, sistemin merkezinde yer alır ve şu bilgileri içerir:

- Hangi `Course` (ders),
- Hangi `Room` (derslik),
- Hangi gün ve saat aralığında gerçekleştirilecek.

##### Bu ilişkiler:
- Bir `Room`, birden fazla `Schedule` kaydında yer alabilir (örneğin farklı saatlerde farklı dersler için kullanılabilir).

### 🛠️ Backend

Proje, N-Tier (Çok Katmanlı) Mimari yaklaşımı ile geliştirilmiştir:

- `Entities`: Veritabanı tablolarını temsil eden sınıflar (Users, Course, Room, Schedule vb.)
- `DataAccess`: Entity Framework Core kullanılarak veri erişimini sağlar.
- `Business`: İş kurallarını yöneten servis sınıfları (`UserManager`, `RoomManager` vb.)
- `Controllers`: HTTP isteklerini karşılayan REST API endpoint'leri.

> 🔺 **Not:** Teslim tarihine yetişmek için bazı Controller'larda servis katmanı atlanarak doğrudan `DbContext` kullanılmıştır. Bu bölümler ileride refactor edilecektir.

---

### 💡 Frontend

React ile bileşen (component) bazlı geliştirilen arayüz aşağıdaki ana sayfalardan oluşur:

- `Login.js` / `Register.js`: Kullanıcı girişi ve kayıt işlemleri
- `Main.js`: Giriş sonrası kullanıcıya sunulan menü ekranı
- `CourseScheduler.js`: Ders programı oluşturma arayüzü
- `RoomAssignments.js`: Derslik yönetimi ve ders atama ekranı
- `ExamSchedulePage.js`: Sınav takvimi oluşturma arayüzü
- `SittingPlan.js`: Sınav oturma düzeni ve PDF çıktısı
- `DoorTag.js`: Kapı isimliği PDF oluşturma

### 🧭 Navigasyon ve Durum Yönetimi

- `react-router-dom`: Sayfalar arası geçiş için kullanılmıştır.
- `useState`, `useEffect`: Component bazlı state yönetimi
- `localStorage`: Kullanıcı bilgilerini geçici olarak saklamak için

---

## 🖼️ Ekran Görüntüleri

### 🔐 Giriş ve Kayıt Sayfası  
Uygulamaya giriş yapılan veya yeni kullanıcıların kayıt olduğu ekran.

![image](https://github.com/user-attachments/assets/476d53b0-ed01-4d91-b9c3-e65b158c7c25)

![image](https://github.com/user-attachments/assets/3082775a-8db2-4863-915e-e0a525afe5bd)



---

### 🧭 Ana Panel  
Rol bazlı menüler ve işlevler.

![image](https://github.com/user-attachments/assets/73cc6823-6070-4bfb-9067-e408d87dc58e)

![image](https://github.com/user-attachments/assets/68bd1cfa-3566-44a3-8b68-0b5938c2e874)

![image](https://github.com/user-attachments/assets/e8367239-ba3c-4ade-9568-2a4b8d8a3fd0)



---

### 📅 Ders Programı Oluşturma  
Derslerin dönemlere göre listelendiği ve haftalık programa sürüklenip bırakıldığı ekran.

![image](https://github.com/user-attachments/assets/6ee9330d-84c0-41d9-82ff-fe1e7a48fde4)

![image](https://github.com/user-attachments/assets/58d68abe-50d6-4995-92a9-6dbba0867d21)

---

### 🧪 Sınav Takvimi Oluşturma  
Sınavların yerleştirildiği haftalık planlama ve yorum ekleme özelliği.

![image](https://github.com/user-attachments/assets/c3f79117-8202-4990-b838-3635231e1814)


---

### 🪑 Oturma Düzeni & PDF  
Rastgele oturma düzeni oluşturma ve çıktı alma ekranı.

![image](https://github.com/user-attachments/assets/145de511-85e7-4b01-9135-e9b23efd452b)

### 🏫 Derslik Ekleme & Derslik Programı  
Yeni dersliklerin tanımlandığı, kapasite bilgilerinin girildiği ve her derslik için program görüntüleme özelliğinin sunulduğu ekran.

![image](https://github.com/user-attachments/assets/756fa47e-057b-48a1-8eac-bc1624494a23)
![image](https://github.com/user-attachments/assets/7b09a976-affe-4bb3-bddf-a2fe1196c650)


---

### 👨‍🏫 Kapı İsimliği Görüntüleme  
Öğretim elemanlarının haftalık ders programının PDF formatında oluşturulduğu, çıktı alınabilir şekilde düzenlenmiş kapı isimliği ekranı.

![image](https://github.com/user-attachments/assets/acf4e619-3b2e-4b04-884c-3957fb7383ea)




