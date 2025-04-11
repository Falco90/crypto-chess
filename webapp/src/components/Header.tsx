import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
    return (
        <div className={styles.header}>
            <h1>CryptoChess</h1>
            <ConnectButton />
        </div>
    )
}

export default Header;