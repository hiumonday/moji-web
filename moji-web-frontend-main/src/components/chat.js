import React from 'react';
import logo from "../assets/logo.png";


const ThinkingCard = ({ isLoading, apiMessage, status, score, isComplete, verbalScore, mathScore }) => {
  const getMessage = () => {
    if (isLoading) {
      return <span className="dots">Thinking</span>;
    }else if (status === 500) {
      return 'Hiện chúng mình chưa thể xử lý được bài làm của bạn. Vui lòng thử lại sau nhé!';
    } else if (!isComplete) {
      return 'Bài thi chưa hoàn thành, AI không thể phân tích được kết quả';
    } else {
      if (typeof apiMessage === 'object') {
        return (
          <div className='ml-6'>
            <div className='mb-3'>
              <b>Với phần Verbal</b>
              <div className='dot-before'>{apiMessage?.result_careless_verbal}</div>
              <div className='dot-before' >{apiMessage?.result_script_skills_verbal}</div>
              <div className='dot-before' >{apiMessage?.result_script_subjects_verbal}</div>
            </div>

            <div className='mt-5'>
              <b>Với phần toán:</b>
              <div className='dot-before'>{apiMessage?.result_careless_math}</div>
              <div className='dot-before'>{apiMessage?.result_overtime_math}</div>
              <div className='dot-before'>{apiMessage?.result_script_subjects_math}</div>
            </div>
          </div>
        );
      } else {
        return apiMessage;
      }
    }
  };

  return (
<div className="flex flex-col-reverse sm:flex-row w-full my-10 space-y-8 sm:space-y-0 sm:space-x-8">
  <div className="w-full sm:w-2/3 bg-[#d7eff7] shadow-lg rounded-lg p-6 text-black border border-[#0b8ce9] flex-col sm:flex-row sm:mt-0 mt-12">
        <div className="flex flex-col justify-between items-start">
          <div className='mb-3 flex items-center mb-3'>
            <img src={logo} alt="Logo" className='w-9 h-9 ml-3' />
            <div className='text-bleu_de_france'><b>MojiAI</b></div>
            {isLoading && <div className="dot-flashing ml-2 animate-pulse bg-bleu_de_france rounded-full w-3 h-3 ml-2"></div>}
          </div>
          <div>{getMessage()}</div>
        </div>
      </div>
      <div className="w-full sm:w-1/3 bg-gray-100 shadow-lg rounded-lg p-0 lg:p-6 border border-[#0b8ce9] flex items-center">
  <div className="w-full p-3 font-sans ">
          <div className="text-center text-2xl font-bold text-gray-800 mb-3">TOTAL SCORE</div>
          <div className="text-center text-5xl font-bold text-gray-800">{score}</div>
          <div className="text-center text-lg text-gray-600">400 - 1600</div>
          <div className="flex justify-between mt-6 sm:w-full w-48 lg:w-48 mx-auto" >
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">Verbal</div>
              <div className="text-4xl font-bold text-gray-800">{verbalScore}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">Math</div>
              <div className="text-4xl font-bold text-gray-800">{mathScore}</div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 text-xs hover:underline">&#9432; Đây chỉ là điểm ước lượng dựa trên thang của College Board, hãy chú ý hơn vào bài làm của bạn thay vì con số này nhé</p>
          </div>
        </div>
      </div>
    </div>
 
  );
};

ThinkingCard.defaultProps = {
  isLoading: true,
  apiMessage: '',
  status: 200
};

export default ThinkingCard;
