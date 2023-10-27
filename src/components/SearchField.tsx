type SearchFieldProps = {
	productNameFilter: string;
	setProductNameFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchField({productNameFilter, setProductNameFilter}: SearchFieldProps) {
  return (
    <div className='flex justify-center py-6'>
        <input
          type='text'
          placeholder='Product Name'
          className='p-2 border-slate-300 border-2 rounded-md outline-slate-500 w-1/4'
          value={productNameFilter}
          onChange={(e) => setProductNameFilter(e.target.value)}
        />
    </div>
  )
}