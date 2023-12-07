
import { Column } from '@ant-design/plots';
function Statistical(){
    const dataChart =[
        {
            "date": "01-2023",
            "quantity": 7455
        },
        {
            "date": "02-2023",
            "quantity": 6415
        },
        {
            "date": "03-2023",
            "quantity": 8276
        },
        {
            "date": "04-2023",
            "quantity": 7617
        },
        {
            "date": "05-2023",
            "quantity": 8380
        },
        {
            "date": "06-2023",
            "quantity": 9585
        },
        {
            "date": "07-2023",
            "quantity": 10620
        },
        {
            "date": "08-2023",
            "quantity": 11211
        },
        {
            "date": "09-2023",
            "quantity": 8870
        },
        {
            "date": "10-2023",
            "quantity": 6414
        },
        {
            "date": "11-2023",
            "quantity": 3471
        },
        {
            "date": "12-2023",
            "quantity": 2143
        }
      ]
      const config = {
        data:dataChart,
        xField:"date",
        yField:"quantity",
        smooth:true,
        point:true,
        xAxis: {
            label: {
              autoRotate: false,
            },
          },
        slider:{
            start:0.1,
            end:0.2
        },
        color: '#000',
      }
    return(
        <>
           <Column  {...config}/>
        </>
    )
}
export default Statistical