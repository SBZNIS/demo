import { NextResponse } from 'next/server';
import getGrades from '../../../lib/getGrades';

export async function GET() {
    try {
        const grades = await getGrades();
        console.log('API response grades:', grades); // Логируем данные перед отправкой ответа
        return NextResponse.json(grades);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ message: 'Failed to get grades', error }, { status: 500 });
    }
}
