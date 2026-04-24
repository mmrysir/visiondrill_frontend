const endPoint = 'https://prod-in2.100ms.live/hmsapi/krish123.app.100ms.live/';
const room_id = '62a350302630221c75a4242e';

export default async function getToken(role, roomId) {
    const response = await fetch(`${endPoint}api/token`, {
        method: 'POST',
        body: JSON.stringify({
            user_id: '5fc62c5872909272bf9995e1',
            role: role, // listener , speaker , moderator
            room_id: roomId,
        }),
    });

    const { token } = await response.json();

    return token;
}
