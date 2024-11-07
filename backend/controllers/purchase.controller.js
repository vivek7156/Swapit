import Purchase from '../models/purchase.model.js';
import Item from '../models/item.model.js';

// 1. Create a Purchase Request
export const createPurchase = async (req, res) => {
    try {
        const { itemId } = req.body;
        const userId = req.user._id;

        // Check if the item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Create new purchase request
        const purchase = new Purchase({
            itemId,
            userId,
            status: 'pending', // Default status
        });

        await purchase.save();
        res.status(201).json({ message: 'Purchase request created successfully', purchase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. Get Purchases for a Specific User
export const getUserPurchases = async (req, res) => {
    try {
        const { userId } = req.params;

        const purchases = await Purchase.find({ userId }).populate('itemId');
        res.status(200).json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. Get Purchases for a Specific Item
export const getItemPurchases = async (req, res) => {
    try {
        const { itemId } = req.params;

        const purchases = await Purchase.find({ itemId }).populate('userId');
        res.status(200).json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 4. Update Purchase Status
export const updatePurchaseStatus = async (req, res) => {
    try {
        const { purchaseId } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const purchase = await Purchase.findByIdAndUpdate(
            purchaseId,
            { status },
            { new: true }
        );

        if (purchase) {
            res.status(200).json({ message: 'Purchase status updated', purchase });
        } else {
            res.status(404).json({ message: 'Purchase not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
