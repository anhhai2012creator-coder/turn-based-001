class UIManager {
    // Xử lý nút Sự kiện ở màn hình chính
    static onClickEventButton(currentEventData) {
        if (!currentEventData || currentEventData.isActive === false) {
            this.showPopup("Chưa có sự kiện");
        } else {
            this.openEventPanel(currentEventData);
        }
    }

    // Xử lý nhập Giftcode
    static onApplyGiftcode(inputCode) {
        const validCodes = {
            "TANTHU001": { type: "anh_sao", amount: 500 },
            "TFJIKOKDAB": { type: "kim_cuong", amount: 299 },
            // ... các code khác
        };

        if (validCodes[inputCode]) {
            let reward = validCodes[inputCode];
            PlayerAccount.addResource(reward.type, reward.amount);
            this.showPopup(`Nhận thành công: ${reward.amount} ${reward.type}`);
        } else {
            this.showPopup("Giftcode không hợp lệ hoặc đã hết hạn!");
        }
    }
}
