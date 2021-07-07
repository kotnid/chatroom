import asyncio
import websockets
import json

USERS = {}

async def main(websocket,path):
    await websocket.send(json.dumps({"type":"handshake"}))
    async for message in websocket:
        data = json.loads(message)
        print(data)
        message = ''
        if data["type"] == 'send':
            name = '404'
            for k , v in USERS.items():
                if v == websocket:
                    name = k

            if len(USERS) != 0:
                message = json.dumps(
                    {"type":"user","content":data["content"],"from":name})

        elif data["type"] == "logout":
            del USERS[data["content"]]
            if len(USERS) != 0:
                message = json.dumps(
                    {"type":"logout","content":data["content"],"user_list":list(USERS.keys())})

        elif data["type"] == "login":
            USERS[data["content"]] = websocket
            if len(USERS) != 0:
                message = json.dumps(
                    {"type":"login","content":data["content"],"user_list":list(USERS.keys())})    

        await asyncio.wait([user.send(message) for user in USERS.values()])                    


                    
start_server = websockets.serve(main,"127.0.0.1",8964)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()