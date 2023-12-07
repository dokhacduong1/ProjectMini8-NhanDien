
import { Column } from '@ant-design/plots';
function OverviewDiagram(props){
    const {attendance} = props
    const dataChart = attendance[0].attendanceData.map(dataMap=>({
        date:dataMap.date,
        quantity:dataMap.students.length
    }));
    const dataChart2 = [
        {
            date:"2023/07/01",
            quantity:34
        },
        {
            date:"2023/07/02",
            quantity:40
        },
        {
            date:"2023/07/03",
            quantity:3
        },
        {
            date:"2023/07/04",
            quantity:54
        },
        {
            date:"2023/07/05",
            quantity:14
        },
        {
            date:"2023/07/06",
            quantity:24
        },
        {
            date:"2023/07/07",
            quantity:40
        },
        {
            date:"2023/07/08",
            quantity:34
        },
        {
            date:"2023/07/09",
            quantity:44
        },
        {
            date:"2023/07/10",
            quantity:42
        },
        {
            date:"2023/07/11",
            quantity:20
        },
        {
            date:"2023/07/12",
            quantity:25
        },
        {
            date:"2023/07/13",
            quantity:29
        },
        {
            date:"2023/07/14",
            quantity:30
        },
    ]
    const config = {
        data:dataChart2,
        xField:"date",
        yField:"quantity",
        smooth:true,
      
        xAxis: {
            label: {
              autoRotate: false,
            },
          },
        color: '#000',
        meta:{
            quantity:{
                alias:"Số Lượng Sinh Viên Đi Học"
            }
        },
        scrollbar: {
            type: 'horizontal',
          },
      }
    return(
        <>
            <Column  {...config}/>
        </>
    )
}
export default OverviewDiagram