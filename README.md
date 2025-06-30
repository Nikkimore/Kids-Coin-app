# Kiss Coin Mini App

A fun heart-catching game built for the World Coin ecosystem where players collect falling hearts to earn Kiss Coins!

## 🎮 Game Overview

Kiss Coin is an engaging mini-game where hearts fall from the top of the screen and players must catch them using a catcher at the bottom. For every 3 hearts caught, players earn 1 Kiss Coin.

### Key Features
- **Simple Gameplay**: Easy to learn, fun to play
- **Heart Catching**: Move your catcher to collect falling hearts
- **Kiss Coin Rewards**: Earn 1 Kiss Coin for every 3 hearts caught
- **Mobile Friendly**: Touch controls for mobile devices
- **World App Integration**: Built specifically for the World Coin ecosystem

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- World App for testing (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kiss-coin-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.sample .env.local
```

4. Configure your `.env.local` file with the required values:
- `AUTH_SECRET`: Generate using `npx auth secret`
- `AUTH_URL`: Your app's URL (for development: http://localhost:3000)
- Add your World App configuration

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 How to Play

1. **Login**: Use your World ID wallet to authenticate
2. **Start Game**: Click the "Start Game" button
3. **Catch Hearts**: Move your mouse or finger to control the catcher
4. **Earn Coins**: Collect 3 hearts to earn 1 Kiss Coin
5. **Have Fun**: Keep playing to increase your score!

### Controls
- **Desktop**: Move your mouse over the game area
- **Mobile**: Touch and drag to move the catcher

## 🏗️ Technical Architecture

### Built With
- **Next.js 15**: React framework
- **TypeScript**: Type-safe development
- **World Coin MiniKit**: Official SDK for World App integration
- **Tailwind CSS**: Styling framework
- **HTML5 Canvas**: Game rendering
- **NextAuth**: Authentication management

### World Coin Integration
- Uses `@worldcoin/minikit-js` for core functionality
- Implements `@worldcoin/minikit-react` hooks
- Follows World App design guidelines
- Proper authentication flow with World ID

## 📱 World App Deployment

### Requirements
1. Register your app in the [World Developer Portal](https://developer.worldcoin.org/)
2. Configure your production domain
3. Set up proper SSL certificates
4. Update environment variables for production

### Deployment Steps
1. Build the application:
```bash
npm run build
```

2. Deploy to your hosting platform
3. Configure your domain in the World Developer Portal
4. Test the app within World App

## 🎨 Game Mechanics

### Scoring System
- **Hearts Caught**: Each heart increases your score by 1
- **Kiss Coins**: Earned at a rate of 1 coin per 3 hearts
- **In-App Currency**: Kiss Coins have no real-world value (clearly disclosed)

### Game Physics
- Hearts fall at varying speeds
- Collision detection between hearts and catcher
- Smooth catcher movement following mouse/touch input

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── (protected)/       # Authenticated routes
│   └── page.tsx           # Landing page
├── components/
│   ├── KissCoinGame/      # Main game component
│   ├── AuthButton/        # Authentication component
│   └── ...               # Other UI components
├── auth/                  # Authentication logic
└── providers/            # React providers
```

### Key Components
- **KissCoinGame**: Main game logic and rendering
- **AuthButton**: World ID authentication
- **PageLayout**: Consistent page structure

## 🌟 Future Enhancements

### Planned Features
- **Leaderboards**: Global high scores
- **Power-ups**: Special abilities and bonuses
- **Customization**: Personalized catchers and hearts
- **Sound Effects**: Audio feedback for actions
- **Tournaments**: Competitive gameplay events

### Monetization Potential
- Integration with WLD/USDC for real-world value
- Smart contract support for blockchain features
- NFT rewards for achievements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [World Coin Documentation](https://docs.world.org/mini-apps)
- Open an issue in this repository
- Contact the development team

## 🎉 Acknowledgments

- World Coin team for the excellent MiniKit SDK
- The open-source community for inspiration
- All beta testers and contributors

---

**Disclaimer**: Kiss Coins are in-app currency with no real-world value. This game is for entertainment purposes only.

