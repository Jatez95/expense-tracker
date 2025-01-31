import './index.css'
import Header from './components/Header';
import DataInsert from './components/DataInsert';
// import DataInsertDifferent from "./components/DataInsertDifferent"
import MainSection from './components/MainSection';

function App() {
  {/*FOR THE FURUTURE ME: PUT the components INSIDE the src folder*/}
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