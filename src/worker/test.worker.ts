const context: Worker = self as any;

context.addEventListener('message', async (event) => {
  console.log('worker側だよ！！ 受け取った値は', event.data);
  const res = event.data * event.data;
  context.postMessage({ input: event.data, output: res }); // 呼び出し元にEventを発火して結果を返す
});

export default context;
