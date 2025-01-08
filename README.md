# SwapIt

SwapIt is a college marketplace web application that enables students to buy, sell, and exchange items within their college community. With SwapIt, students can easily connect with peers to trade books, electronics, and other essentials.

## 🌟 Features

- **User Authentication**: Secure user registration and login.
- **Item Listings**: Post, edit, and delete items for sale or exchange.
- **Search and Filters**: Easily find items using keywords, categories, and filters.
- **Chat Functionality**: Real-time chat between buyers and sellers using Socket.IO.
- **Notifications**: Alerts for new messages, purchase requests, and approvals.
- **Responsive Design**: Fully optimized for mobile and desktop devices.

## 🚀 Live Demo
Visit the live application: [SwapIt](https://swapit-vhlk.onrender.com/)

### part-1
https://github.com/user-attachments/assets/46e2212c-5aac-4c0e-a24c-4af406dc0931

### part-2
https://github.com/user-attachments/assets/3a85946b-1f74-4507-be99-3b3e7b959c5f

### part-3
https://github.com/user-attachments/assets/c6297c1a-f9c5-421f-b4f7-da5fb760309a

### part-4
https://github.com/user-attachments/assets/3969de58-8891-4378-a531-b1b6684d0ad3



## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB
- **Deployment**: Render

## 📦 Installation

Follow these steps to set up SwapIt locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vivek7156/Swapit.git
   cd Swapit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=   
   CLOUDINARY_API_KEY=  
   CLOUDINARY_API_SECRET= 
   ```

4. **Run the development server**:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 🧪 Testing

Run the following command to execute tests:
```bash
npm test
```

## 📄 Project Structure

```
.
├── public         # Static assets
├── src
│   ├── components # Reusable components
│   ├── pages      # React pages
│   ├── styles     # Tailwind CSS configuration
│   ├── utils      # Utility functions
│   └── hooks      # Custom hooks
├── server         # Backend code
│   ├── routes     # API routes
│   ├── models     # Database models
│   ├── controllers# Route logic
│   └── sockets    # Socket.IO logic
├── .env.example   # Environment variable example file
└── README.md      # Project documentation
```

## 🌍 Deployment

SwapIt is deployed on Render. Any push to the `main` branch will trigger automatic deployments.

## 🤝 Contribution

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add a feature"
   ```
4. Push your changes:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## 📧 Contact

For any inquiries or support, feel free to contact:

- **Author**: Vivek Singh
- **Email**: [vivek](mailto:viveksingh7156@gmail.com)
- **GitHub**: [Vivek Singh](https://github.com/vivek7156)

---

**Disclaimer**: SwapIt is a personal project created for educational purposes. Use it responsibly.

