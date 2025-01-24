import './index.css'
import Header from '../components/Header';
import DataInsert from '../components/DataInsert';
import MainSection from '../components/MainSection';

function App() {

  return (
    <>
      <Header />
      <section className='w-full h-full'>
        <DataInsert />
      </section>
      <main className='w-full h-full'>
        <MainSection />
      </main>
    </>
  );
}

export default App