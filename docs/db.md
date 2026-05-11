# Database

## 1. Equipments

| id  | name        | quantity | picture                                         |
| --- | ----------- | -------- | ----------------------------------------------- |
| 1   | Equipment 1 | 5        | ![Equipment 1](https://via.placeholder.com/150) |

### Adding New Equipment

To add new equipment, use the **Add Equipment** page accessible from `/add-equipment`. The form accepts:
- **Equipment Title** (required): Name of the equipment
- **Quantity** (required): Number of items (must be > 0)
- **Picture** (optional): Image file (base64 encoded and stored in picture field)

The form validates input and displays a preview of the selected image before submission.

## 2. Borrowings

| id  | equipmentId | class | borrowedAt | returnedAt |
| --- | ----------- | ----- | ---------- | ---------- |
| 1   | 1           | 1A    | 2024-01-01 | 2024-01-10 |
