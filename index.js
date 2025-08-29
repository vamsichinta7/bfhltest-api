const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(express.json());

// POST /bfhl endpoint
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        // Validate input
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Invalid request body. 'data' must be an array."
            });
        }

        // Your details
        const user_id = "sai_giri_sekhara_vamsi_chinta_11112004";
        const email = "vamsichinta7@gmail.com";
        const roll_number = "22BCE9499";

        // Initialize arrays
        const odd_numbers = [];
        const even_numbers = [];
        const alphabets = [];
        const special_characters = [];
        let sum = 0;

        // Process each item in data array
        data.forEach(item => {
            const str = String(item);
            
            // Check if it's a pure integer (including negative)
            const integerMatch = str.match(/^-?\d+$/);
            if (integerMatch) {
                const num = parseInt(str);
                sum += num;
                if (num % 2 === 0) {
                    even_numbers.push(str);
                } else {
                    odd_numbers.push(str);
                }
            }
            // Check if it's purely alphabetic
            else if (/^[a-zA-Z]+$/.test(str)) {
                alphabets.push(str.toUpperCase());
            }
            // Everything else is special character
            else {
                special_characters.push(str);
            }
        });

        // Create concat_string with complex logic
        let concat_string = "";
        if (alphabets.length > 0) {
            // Join all alphabets, reverse, then apply alternating caps
            const joined = alphabets.join('');
            const reversed = joined.split('').reverse().join('');
            
            concat_string = reversed.split('').map((char, index) => {
                return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
            }).join('');
        }

        // Return response
        res.json({
            is_success: true,
            user_id,
            email,
            roll_number,
            odd_numbers,
            even_numbers,
            alphabets,
            special_characters,
            sum: String(sum),
            concat_string
        });

    } catch (error) {
        res.status(400).json({
            is_success: false,
            message: "Error processing request"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
