const prisma = require("../config/db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { fname, lname, username, email, password } = req.body;

        if (!fname || !lname || !username || !email || !password) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูล"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username: username }, { email: email }]
            },
            select: {
                username: true,
                email: true,
            }
        })

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(409).json({
                    message: "ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว"
                });
            }

            if (existingUser.email === email) {
                return res.status(409).json({
                    message: "อีเมลนี้ถูกใช้งานไปแล้ว"
                })
            }
        }

        const password_hash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                fname: fname,
                lname: lname,
                username: username,
                email: email,
                password: password_hash
            },
            select: {
                id: true,
                fname: true,
                lname: true,
                username: true,
                email: true,
                role: true
            }
        })

        return res.status(201).json({
            data: newUser
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูล"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                fname: true,
                lname: true,
                username: true,
                email: true,
                password: true,
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            })
        }

        const check_password = await bcrypt.compare(password, user.password)

        if (!check_password) {
            return res.status(401).json({
                message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        )

        return res.status(200).json({
            token: token,
            data: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}