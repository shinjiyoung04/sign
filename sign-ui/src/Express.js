// server.js 또는 routes 파일에 추가
app.delete('/api/contracts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // MongoDB를 사용하는 경우
    await Contract.findByIdAndDelete(id);
    res.status(200).json({ message: '계약서가 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '삭제 중 오류 발생' });
  }
});
