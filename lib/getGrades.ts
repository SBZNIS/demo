import puppeteer from 'puppeteer';
import testLogin from './testLogin';
import dotenv from 'dotenv';

dotenv.config();

interface Grade {
    name: string;
    currentGrades: string;
}

async function getGrades(): Promise<Grade[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    try {
        await page.goto('https://school.bilimal.kz', {
            waitUntil: 'networkidle2',
            timeout: 60000 // Увеличиваем тайм-аут до 60 секунд
        });

        await testLogin(process.env.LOGIN as string, process.env.PASS as string, page);

        const loginSuccess = await page.evaluate(() => {
            return document.querySelector('.main-header-user-title.mr-3') !== null;
        });

        if (!loginSuccess) {
            console.error('Login failed or took too long');
            await browser.close();
            return [];
        }

        // Перейдите на страницу с оценками и убедитесь, что она полностью загружена
        await page.goto('https://school.bilimal.kz/cabinet_teacher/advisement/performance', {
            waitUntil: 'networkidle2',
            timeout: 60000 // Увеличиваем тайм-аут до 60 секунд
        });
        await page.waitForSelector('table.items', { timeout: 60000 }); // Убедитесь, что таблица загрузилась

        // Сбор данных из таблицы
        const grades: Grade[] = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table.items tbody tr'));
            return rows.map(row => {
                const columns = row.querySelectorAll('td');
                const name = columns[1].innerText; // ФИО учащегося
                const currentGrades = columns[6].innerText; // Текущие оценки
                return {
                    name: name,
                    currentGrades: currentGrades,
                };
            });
        });

        await browser.close();
        return grades;

    } catch (error) {
        console.error('Failed to navigate:', error);
        await browser.close();
        return [];
    }
}

export default getGrades;
