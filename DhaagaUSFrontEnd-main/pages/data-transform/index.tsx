const DataTransform = () => {
  return (
    // <form action="/api/data" method="POST" encType="multipart/form-data">
    <form action="/api/data">
      <input type="file" name="data" id="data" />
      <button>Submit</button>
    </form>
  );
};

export default DataTransform;
