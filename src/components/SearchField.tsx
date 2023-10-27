type SearchFieldProps = {
	productNameFilter: string;
	setProductNameFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchField({productNameFilter, setProductNameFilter}: SearchFieldProps) {
  return (
    <div className='flex justify-center py-6'>
        <input
          type='text'
          placeholder='Search by Product Name'
          value={productNameFilter}
          onChange={(e) => setProductNameFilter(e.target.value)}
        />
    </div>
  )
}